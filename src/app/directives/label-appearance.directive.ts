import { AfterViewInit, Directive, ElementRef, Input, NgZone, OnChanges, OnDestroy, Renderer2 } from '@angular/core';
import { labelContrast, labelTextColor, opaqueCssColor } from '../utils/label-contrast';

/** Color and boundary styling only; label persistence and note metadata are untouched. */
@Directive({ selector: '[appLabelAppearance]', standalone: false })
export class LabelAppearanceDirective implements AfterViewInit, OnChanges, OnDestroy {
  @Input() appLabelAppearance: 'sidebar' | 'chip' = 'chip';
  @Input() labelColor = '#e53935';
  private observer?: MutationObserver;
  private frame?: number;
  private surface?: HTMLElement;
  private readonly transitionEnd = () => this.schedule();

  constructor(private element: ElementRef<HTMLElement>, private renderer: Renderer2, private zone: NgZone) {}

  ngAfterViewInit() {
    this.surface = this.element.nativeElement.closest<HTMLElement>(
      this.appLabelAppearance === 'sidebar' ? '.item' : '.note-container, .note-main'
    ) || this.element.nativeElement.parentElement!;
    this.zone.runOutsideAngular(() => {
      this.surface!.addEventListener('transitionend', this.transitionEnd);
      this.observer = new MutationObserver(() => this.schedule());
      // Actual row/note styles and ancestor theme/visibility changes can change the surface.
      for (let node: HTMLElement | null = this.surface!; node; node = node.parentElement) {
        this.observer.observe(node, { attributes: true, attributeFilter: ['class', 'style'] });
      }
      this.schedule();
    });
  }

  ngOnChanges() { this.schedule(); }

  private schedule() {
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
    this.zone.runOutsideAngular(() => { this.frame = requestAnimationFrame(() => this.paint()); });
  }

  private paint() {
    this.frame = undefined;
    if (!this.surface) return;
    const color = /^#[0-9a-f]{6}$/i.test(this.labelColor) ? this.labelColor : '#e53935';
    const host = this.element.nativeElement;
    this.renderer.setStyle(host, 'background-color', color);
    const chip = this.appLabelAppearance === 'chip';
    if (chip) this.renderer.setStyle(host, 'color', labelTextColor(color));
    let background: string | null = null;
    let image = false;
    for (let node: HTMLElement | null = this.surface; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      image ||= style.backgroundImage !== 'none';
      background = opaqueCssColor(style.backgroundColor);
      if (background) break;
    }
    background ||= document.body.classList.contains('light-theme') ? '#ffffff' : '#202124';
    const needsOutline = (chip || this.surface.classList.contains('active'))
      && (chip && image || labelContrast(color, background) < 3);
    const ink = opaqueCssColor(getComputedStyle(this.surface).getPropertyValue('--note-ink').trim());
    const outline = chip && ink && (image || labelContrast(ink, background) >= 3) ? ink : labelTextColor(background);
    this.renderer.setStyle(host, 'outline', needsOutline ? `1px solid ${outline}` : 'none');
    this.renderer.setStyle(host, 'outline-offset', '0px');
  }

  ngOnDestroy() {
    this.observer?.disconnect();
    this.surface?.removeEventListener('transitionend', this.transitionEnd);
    if (this.frame !== undefined) cancelAnimationFrame(this.frame);
  }
}
