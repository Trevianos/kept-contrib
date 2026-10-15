import { SettingsComponent } from './settings.component';
import { AuthService } from '../../services/auth.service';
import { AdminGuard, AuthGuard } from '../../services/auth.guard';
import { Router } from '@angular/router';

describe('Settings profile', () => {
  let component: SettingsComponent;
  let auth: jasmine.SpyObj<AuthService>;
  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['updateProfile', 'resetOwnPassword']);
    auth.updateProfile.and.resolveTo();
    auth.resetOwnPassword.and.resolveTo({ success: true });
    component = new SettingsComponent({ detectChanges() {} } as any, null!, null!, null!, null!, auth, null!, null!);
  });

  it('saves the name, uploaded avatar and preset through the existing self API', async () => {
    component.avatarPreview = 'data:image/png;base64,test';
    component.avatarPresetPreview = 'fox';
    await component.saveProfile('Alice');
    expect(auth.updateProfile).toHaveBeenCalledWith('Alice', 'data:image/png;base64,test', 'fox');
    expect(component.profileSuccess).toBeTruthy();
  });

  it('removes the photo and selects a different existing animal preset', async () => {
    component.avatarPreview = 'photo';
    component.avatarPresetPreview = 'cat';
    component.clearAvatar();
    expect(component.avatarPreview).toBe('');
    expect(component.avatarPresetPreview).not.toBe('cat');
    expect(['fox', 'bunny', 'bear', 'panda', 'guinea-pig', 'capybara']).toContain(component.avatarPresetPreview);
    await component.saveProfile('Alice');
    expect(auth.updateProfile).toHaveBeenCalledWith('Alice', '', component.avatarPresetPreview);
  });

  it('loads and resizes an uploaded image before saving it', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const blob = await new Promise<Blob>(resolve => canvas.toBlob(value => resolve(value!), 'image/png'));
    await new Promise<void>(resolve => {
      (component as any).cdr = { detectChanges: resolve };
      component.uploadAvatar({ target: { files: [new File([blob], 'avatar.png', { type: 'image/png' })] } } as any);
    });
    const image = new Image();
    await new Promise<void>(resolve => { image.onload = () => resolve(); image.src = component.avatarPreview; });
    expect(image.width).toBe(512);
    expect(image.height).toBe(384);
    await component.saveProfile('Alice');
    expect(auth.updateProfile).toHaveBeenCalledWith('Alice', component.avatarPreview, 'cat');
  });

  it('rejects non-image uploads without replacing the preview', () => {
    component.avatarPreview = 'existing';
    component.uploadAvatar({ target: { files: [new File(['test'], 'test.txt', { type: 'text/plain' })] } } as any);
    expect(component.profileError).toBeTruthy();
    expect(component.avatarPreview).toBe('existing');
  });

  it('reports profile API errors', async () => {
    auth.updateProfile.and.rejectWith({ error: { error: 'Rejected' } });
    await component.saveProfile('Alice');
    expect(component.profileError).toBe('Rejected');
    expect(component.profileSuccess).toBe('');
  });

  it('rejects short and mismatched passwords without sending a request', async () => {
    component.newPassword = 'short';
    await component.resetMyPassword();
    expect(component.passwordResetError).toContain('8 characters');
    component.newPassword = 'longpassword';
    component.confirmNewPassword = 'different';
    await component.resetMyPassword();
    expect(component.passwordResetError).toContain('match');
    expect(auth.resetOwnPassword).not.toHaveBeenCalled();
  });

  it('sends the current password and clears all password fields after success', async () => {
    component.currentPassword = 'old-password';
    component.newPassword = component.confirmNewPassword = 'new-password';
    await component.resetMyPassword();
    expect(auth.resetOwnPassword).toHaveBeenCalledWith('old-password', 'new-password');
    expect([component.currentPassword, component.newPassword, component.confirmNewPassword]).toEqual(['', '', '']);
    expect(component.isResettingPassword).toBeFalse();
    expect(component.passwordResetSuccess).toBeTruthy();
  });

  it('preserves server password validation errors and restores the submit button', async () => {
    auth.resetOwnPassword.and.rejectWith({ error: { error: 'Current password is incorrect' } });
    component.currentPassword = 'wrong';
    component.newPassword = component.confirmNewPassword = 'new-password';
    await component.resetMyPassword();
    expect(component.passwordResetError).toBe('Current password is incorrect');
    expect(component.isResettingPassword).toBeFalse();
  });
});

describe('Profile navigation access guards', () => {
  for (const admin of [false, true]) {
    it(`protects direct Users access and allows Settings for admin=${admin}`, async () => {
      const auth = { currentUser: {}, isAdmin: admin } as AuthService;
      const denied = {} as any;
      const router = { createUrlTree: jasmine.createSpy().and.returnValue(denied) } as unknown as Router;
      expect(await new AdminGuard(auth, router).canActivate()).toBe(admin ? true : denied);
      expect(await new AuthGuard(auth, router).canActivate()).toBeTrue();
    });
  }
  it('redirects signed-out Users access to login', async () => {
    const auth = { currentUser: null } as AuthService;
    const router = { createUrlTree: jasmine.createSpy().and.returnValue({}) } as unknown as Router;
    await new AdminGuard(auth, router).canActivate();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
