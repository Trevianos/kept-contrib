import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LabelColorPickerComponent, LABEL_COLORS } from './label-color-picker.component';

describe('Label color picker', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [LabelColorPickerComponent], imports: [CommonModule] }).compileComponents();
  });

  it('offers 12 named colors and emits the selected identity', () => {
    const fixture = TestBed.createComponent(LabelColorPickerComponent);
    fixture.componentInstance.label = 'Work';
    fixture.componentInstance.color = '#1e63d5';
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.color-trigger')?.getAttribute('aria-label')).toBe('Color for Work');
    const choices = root.querySelectorAll<HTMLButtonElement>('.palette button');
    expect(choices.length).toBe(12);
    expect(root.querySelector('[aria-pressed="true"]')?.getAttribute('aria-label')).toBe('Blue');
    const emitted = spyOn(fixture.componentInstance.colorChange, 'emit');
    choices[9].click();
    expect(emitted).toHaveBeenCalledWith(LABEL_COLORS[9][1]);
  });

  it('opens in the top layer inside a transformed, clipped mobile modal and returns focus', async () => {
    const fixture = TestBed.createComponent(LabelColorPickerComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    root.style.cssText = 'transform:translate(10px,10px);overflow:hidden;width:100px;height:44px';
    const trigger = root.querySelector<HTMLButtonElement>('.color-trigger')!;
    trigger.click(); fixture.detectChanges();
    const palette = root.querySelector<HTMLElement>('.palette')!;
    expect(palette.matches(':popover-open')).toBeTrue();
    expect(palette.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
    expect(palette.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight);
    const color = palette.querySelector<HTMLButtonElement>('button')!;
    expect(color.getBoundingClientRect().width).toBe(44);
    expect(color.getBoundingClientRect().height).toBe(44);
    color.click(); fixture.detectChanges();
    expect(palette.matches(':popover-open')).toBeFalse();
    expect(document.activeElement).toBe(trigger);
  });
});
