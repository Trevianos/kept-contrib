import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { LabelsService } from './labels.service';
import { AuthService } from './auth.service';
import { SharedService } from './shared.service';

describe('Label color persistence', () => {
  let service: LabelsService;
  let http: HttpTestingController;
  const auth = { currentUser: { id: 88321 }, currentUser$: new BehaviorSubject({ id: 88321 }), authHeaders: () => ({}) };
  beforeEach(() => {
    localStorage.removeItem('kept_label_colors:/api:88321');
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [LabelsService, { provide: AuthService, useValue: auth }] });
    service = TestBed.inject(LabelsService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('creates and reloads a label with its color', async () => {
    const result = service.add({ name: 'Work', color: '#00897b' });
    const create = http.expectOne(req => req.method === 'POST' && req.url.endsWith('/labels'));
    expect(create.request.body.color).toBe('#00897b');
    create.flush({ id: 3, name: 'Work', color: '#00897b' });
    await Promise.resolve();
    http.expectOne(req => req.method === 'GET' && req.url.endsWith('/labels')).flush([{ id: 3, name: 'Work', color: '#00897b' }]);
    expect(await result).toBe(3);
    expect(service.labelsList$.value[0].color).toBe('#00897b');
    auth.currentUser$.next(auth.currentUser);
    expect(service.labelsList$.value[0].color).toBe('#00897b');
  });
  it('patches color without changing the name or assignments', async () => {
    const result = service.update({ color: '#d81b60' }, 3);
    const patch = http.expectOne(req => req.method === 'PATCH');
    expect(patch.request.body).toEqual({ color: '#d81b60' });
    patch.flush({}); await Promise.resolve();
    http.expectOne(req => req.method === 'GET').flush([{ id: 3, name: 'Work', color: '#d81b60' }]);
    await result;
    expect(service.labelsList$.value[0].color).toBe('#d81b60');
  });
  it('uses current label metadata for old note copies and falls back safely to red', () => {
    const shared = { label: { list: [{ id: 3, name: 'Work', color: '#00897b' }] } };
    expect(SharedService.prototype.labelColor.call(shared, { id: 3, name: 'Work', color: '#d81b60' })).toBe('#00897b');
    expect(SharedService.prototype.labelColor.call(shared, { id: 5, name: 'Old' })).toBe('#e53935');
    expect(SharedService.prototype.labelColor.call(shared, { name: 'Invalid', color: 'url(test)' })).toBe('#e53935');
    shared.label.list[0].color = '';
    expect(SharedService.prototype.labelColor.call(shared, { id: 3, name: 'Work', color: '#d81b60' })).toBe('#e53935');
  });
});
