import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { ph } from '../../pipes/ph.pipe';
import { NavbarComponent } from './navbar.component';

describe('Avatar navigation', () => {
  let auth: any;
  beforeEach(async () => {
    auth = { currentUser: { displayName: 'Alice', theme: 'light' }, isAdmin: false, logout: jasmine.createSpy().and.resolveTo() };
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [NavbarComponent, ph],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: SharedService, useValue: {
          selectedNoteIds: new BehaviorSubject([]), searchQuery: '', note: { all: [] },
          noteViewType: new BehaviorSubject('grid'), label: { list: [] }, binder: { list: [] }
        } }
      ], schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  for (const admin of [false, true]) {
    it(`shows only permitted navigation for admin=${admin}`, () => {
      auth.isAdmin = admin;
      const fixture = TestBed.createComponent(NavbarComponent);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('[aria-label="User menu"]').click();
      fixture.detectChanges();
      const menu = fixture.nativeElement.querySelector('#user-menu');
      expect(!!menu.querySelector('[href="/users"]')).toBe(admin);
      expect(menu.querySelector('[href="/settings"]')).toBeTruthy();
      expect(menu.querySelectorAll('a, button').length).toBe(admin ? 3 : 2);
      expect(menu.querySelector('input')).toBeNull();
      menu.querySelector('[href="/settings"]').click();
      fixture.detectChanges();
      expect(fixture.componentInstance.isProfileOpen).toBeFalse();
    });
  }

  it('closes on outside click, Escape, and repeated avatar click', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const avatar = fixture.nativeElement.querySelector('[aria-label="User menu"]');
    avatar.click(); fixture.detectChanges();
    expect(avatar.getAttribute('aria-expanded')).toBe('true');
    document.body.click(); fixture.detectChanges();
    expect(fixture.componentInstance.isProfileOpen).toBeFalse();
    avatar.click(); fixture.detectChanges();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(fixture.componentInstance.isProfileOpen).toBeFalse();
    avatar.click(); avatar.click(); fixture.detectChanges();
    expect(fixture.componentInstance.isProfileOpen).toBeFalse();
  });

  it('uses the navigation font and aligned icons in both themes', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.componentInstance.isProfileOpen = true;
    fixture.detectChanges();
    const wasLight = document.body.classList.contains('light-theme');
    try {
      for (const light of [false, true]) {
        document.body.classList.toggle('light-theme', light);
        const item = fixture.nativeElement.querySelector('#user-menu a');
        const style = getComputedStyle(item);
        expect(style.fontFamily).toContain('Kept Sans');
        expect(style.fontSize).toBe('14px');
        expect(style.fontWeight).toBe('500');
        expect(style.alignItems).toBe('center');
        const icon = getComputedStyle(item.querySelector('.material-symbols-outlined'));
        expect(icon.fontSize).toBe('20px');
        expect(icon.color).toBe(style.color);
      }
    } finally {
      document.body.classList.toggle('light-theme', wasLight);
    }
  });

  it('uses the existing logout and navigates to login', async () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const navigate = spyOn(TestBed.inject(Router), 'navigateByUrl').and.resolveTo(true);
    await fixture.componentInstance.logout();
    expect(auth.logout).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
