import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LabelAppearanceDirective } from './label-appearance.directive';
import { labelContrast, labelTextColor } from '../utils/label-contrast';
import { LABEL_COLORS } from '../components/label-color-picker/label-color-picker.component';

@Component({ standalone: false, template: `<section class="note-main" [style.background-color]="surface" [style.background-image]="image" style="--note-ink:#202124"><div class="label-container label-color-chip" appLabelAppearance="chip" [labelColor]="color"><span>Work</span></div></section><div class="item" [class.active]="active" [style.background-color]="surface"><span appLabelAppearance="sidebar" [labelColor]="color"></span></div>` })
class AppearanceHost {
  color = '#ef6c00'; surface = '#ffa726'; image = 'none'; active = false;
}
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

describe('Label visual contrast', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [AppearanceHost, LabelAppearanceDirective] }).compileComponents();
  });
  it('chooses black or white with WCAG contrast >= 4.5 for every palette color and luminance edge', () => {
    for (const color of [...LABEL_COLORS.map(choice => choice[1]), '#000000', '#ffffff', '#777777', '#808080']) {
      expect(labelContrast(color, labelTextColor(color))).toBeGreaterThanOrEqual(4.5);
    }
    expect(labelTextColor('#000000')).toBe('#ffffff');
    expect(labelTextColor('#ffffff')).toBe('#000000');
  });
  it('outlines only low contrast active sidebar dots against the actual row color', async () => {
    const fixture = TestBed.createComponent(AppearanceHost);
    fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame();
    const dot = fixture.nativeElement.querySelector('.item span') as HTMLElement;
    expect(dot.style.outlineStyle).toBe('none');
    fixture.componentInstance.active = true; fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame(); await frame();
    expect(dot.style.outlineStyle).toBe('solid');
    expect(dot.style.outlineColor).toBe('rgb(0, 0, 0)');
    fixture.componentInstance.color = '#5145cd'; fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame();
    expect(dot.style.outlineStyle).toBe('none');
    // The real row surface, not a hardcoded orange, determines the outline color.
    fixture.componentInstance.surface = '#202124'; fixture.componentInstance.color = '#202124';
    fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame(); await frame();
    expect(dot.style.outlineColor).toBe('rgb(255, 255, 255)');
    dot.parentElement!.style.transition = 'background-color 60ms linear';
    fixture.componentInstance.color = '#ef6c00'; fixture.componentInstance.surface = '#ffa726';
    fixture.changeDetectorRef.markForCheck(); fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 130)); await frame();
    expect(dot.style.outlineStyle).toBe('solid');
    expect(dot.style.outlineColor).toBe('rgb(0, 0, 0)');

    fixture.destroy();
  });
  it('fills chips with unchanged RGB and adds one boundary only for similar or image surfaces', async () => {
    const fixture = TestBed.createComponent(AppearanceHost);
    fixture.componentInstance.color = '#f9a825'; fixture.componentInstance.surface = '#f9a825';
    fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame();
    const chip = fixture.nativeElement.querySelector('.label-color-chip') as HTMLElement;
    expect(chip.style.backgroundColor).toBe('rgb(249, 168, 37)');
    expect(chip.style.color).toBe('rgb(0, 0, 0)');
    expect(chip.style.outlineWidth).toBe('1px');
    fixture.componentInstance.surface = '#202124'; fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame(); await frame();
    expect(chip.style.outlineStyle).toBe('none');
    fixture.componentInstance.image = 'linear-gradient(black,white)'; fixture.changeDetectorRef.markForCheck(); fixture.detectChanges(); await frame(); await frame();
    expect(chip.style.outlineStyle).toBe('solid');
    expect(chip.style.backgroundColor).toBe('rgb(249, 168, 37)');
    fixture.destroy();
  });
});
