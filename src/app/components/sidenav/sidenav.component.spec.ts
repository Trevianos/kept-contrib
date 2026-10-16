import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { NavComponent } from './sidenav.component';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';

@Component({ template: '' })
class RouteTargetComponent {}

describe('Sidebar active Binder and Label', () => {
  const binders = ['Auta', 'Dům a zahrada', 'České poznámky', 'Auta další', 'Znaky / ? # % +'];
  const labels = ['Úkoly doma', 'Běžné', 'Běžné další', 'Znaky / ? # % +'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [CommonModule, RouterModule],
      providers: [
        provideRouter([
          { path: 'binder/:name', component: RouteTargetComponent },
          { path: 'label/:name', component: RouteTargetComponent },
          { path: 'binder/:name/child', component: RouteTargetComponent },
          { path: 'label/:name/child', component: RouteTargetComponent }
        ]),
        { provide: SharedService, useValue: {
          initPwa: () => {},
          binder: { list: binders.map(name => ({ name })) },
          label: { list: labels.map(name => ({ name })) },
          closeSideBar: new Subject(),
          closeSideBarIfOpen: new Subject(),
          sideBarCollapsed: new BehaviorSubject(false),
          showInstallButton: of(false)
        } },
        { provide: AuthService, useValue: { isAdmin: false } }
      ]
    }).compileComponents();
  });

  for (const [section, names] of [['binder', binders], ['label', labels]] as const) {
    for (const name of names) {
      it(`highlights only ${section} ${name} after encoded navigation`, async () => {
        const fixture = TestBed.createComponent(NavComponent);
        const router = TestBed.inject(Router);
        fixture.detectChanges();
        const url = router.serializeUrl(router.createUrlTree(['/' + section, name]));
        await router.navigateByUrl(url);
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const active = fixture.nativeElement.querySelectorAll('.is-binder.active, .is-label.active');
        expect(active.length).toBe(1);
        expect(active[0].getAttribute('title')).toBe(name);
        expect(active[0].classList.contains('is-' + section)).toBeTrue();

        await router.navigateByUrl(url + '/child');
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelectorAll('.is-binder.active, .is-label.active').length).toBe(0);
        fixture.destroy();
      });
    }
  }

  it('keeps independent section state across recreation and scrolls the whole sidebar', () => {
    const auth = TestBed.inject(AuthService) as any;
    auth.currentUser = { id: 934 };
    const keys = ['binders', 'labels'].map(section => `kept_sidebar_${section}_expanded:934`);
    const previous = keys.map(key => localStorage.getItem(key));
    keys.forEach(key => localStorage.removeItem(key));
    try {
      let fixture = TestBed.createComponent(NavComponent);
      fixture.detectChanges();
      const binderToggle = fixture.nativeElement.querySelector('[aria-controls="sidebar-binders"]');
      binderToggle.click();
      fixture.detectChanges();
      expect(binderToggle.getAttribute('aria-expanded')).toBe('false');
      expect(fixture.nativeElement.querySelector('#sidebar-binders').hidden).toBeTrue();
      expect(fixture.nativeElement.querySelector('#sidebar-labels').hidden).toBeFalse();
      expect(getComputedStyle(fixture.nativeElement.querySelector('.main-sidebar')).overflowY).toBe('auto');
      expect(fixture.nativeElement.querySelector('.sidenav-labels-wrap')).toBeNull();
      fixture.destroy();
      fixture = TestBed.createComponent(NavComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.bindersExpanded).toBeFalse();
      expect(fixture.componentInstance.labelsExpanded).toBeTrue();
      fixture.nativeElement.querySelector('[aria-controls="sidebar-labels"]').click();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#sidebar-labels').hidden).toBeTrue();
      fixture.destroy();
    } finally {
      keys.forEach((key, index) => previous[index] === null ? localStorage.removeItem(key) : localStorage.setItem(key, previous[index]!));
    }
  });

  it('disables disclosure controls for empty sections', () => {
    const shared = TestBed.inject(SharedService);
    shared.binder.list = [];
    shared.label.list = [];
    const fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    for (const button of fixture.nativeElement.querySelectorAll('.section-toggle') as NodeListOf<HTMLButtonElement>) {
      expect(button.disabled).toBeTrue();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    }
    fixture.destroy();
  });
});
