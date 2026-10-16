import { Component, EventEmitter, Input, Output } from '@angular/core';

export const LABEL_COLORS = [
  ['Red', '#e53935'], ['Orange', '#ef6c00'], ['Yellow', '#f9a825'],
  ['Lime', '#9e9d24'], ['Green', '#2e7d32'], ['Teal', '#00897b'],
  ['Cyan', '#0086b3'], ['Blue', '#1e63d5'], ['Indigo', '#5145cd'],
  ['Purple', '#8e24aa'], ['Pink', '#d81b60'], ['Brown', '#795548']
];

@Component({
  selector: 'app-label-color-picker',
  standalone: false,
  template: `
    <button #trigger type="button" class="color-trigger" [attr.aria-label]="'Color for ' + label"
      [attr.aria-expanded]="open" (click)="toggle(trigger, palette)">
      <span class="label-color-dot" [style.background-color]="color" aria-hidden="true"></span>
    </button>
    <div #palette popover="auto" (toggle)="onToggle($event)" class="palette" [style.top.px]="top" [style.left.px]="left" role="group" [attr.aria-label]="'Color for ' + label"
        (keydown.escape)="trigger.focus()">
        @for (choice of colors; track choice[1]) {
          <button type="button" [attr.aria-label]="choice[0]" [title]="choice[0]"
            [attr.aria-pressed]="color.toLowerCase() === choice[1]"
            (click)="colorChange.emit(choice[1]); palette.hidePopover(); trigger.focus()">
            <span class="label-color-dot" [style.background-color]="choice[1]" aria-hidden="true"></span>
            <span class="selected" aria-hidden="true">{{color.toLowerCase() === choice[1] ? '\u2713' : ''}}</span>
          </button>
        }
    </div>
  `,
  styles: [`
    :host { display: inline-block; position: relative; flex-shrink: 0; }
    button { cursor: pointer; border: 0; border-radius: 8px; background: transparent; color: inherit;
      width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center; }
    button:hover { background: rgb(128 128 128 / 20%); }
    button:focus-visible { outline: 2px solid currentColor; outline-offset: -3px; }
    .label-color-dot { margin: 0; }
    .palette:not(:popover-open) { display: none; }
    .palette { margin: 0; display: grid; grid-template-columns: repeat(4, 44px); padding: 8px;
      background: var(--label-picker-bg, #fff); color: var(--label-picker-ink, #202124);
      border: 1px solid #808080; border-radius: 12px; box-shadow: 0 4px 12px #0004;
      position: fixed; z-index: 10000; }
    .palette button { position: relative; }
    .selected { position: absolute; right: 0; top: 0; font-size: 14px; font-weight: bold; }
  `]
})
export class LabelColorPickerComponent {
  @Input() color = '#e53935';
  @Input() label = '';
  @Output() colorChange = new EventEmitter<string>();
  colors = LABEL_COLORS;
  open = false;
  top = 0;
  left = 0;
  onToggle(event: Event) {
    this.open = (event as Event & { newState: string }).newState === 'open';
  }

  toggle(trigger: HTMLButtonElement, palette: HTMLElement) {
    const rect = trigger.getBoundingClientRect();
    this.left = Math.max(8, Math.min(rect.left, window.innerWidth - 202));
    this.top = Math.max(8, Math.min(rect.bottom, window.innerHeight - 158));
    palette.togglePopover();
  }
}
