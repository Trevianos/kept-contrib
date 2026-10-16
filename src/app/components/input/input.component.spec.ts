import { ElementRef } from '@angular/core';
import { InputComponent } from './input.component';

describe('Editor formatting regression (native browser editing)', () => {
  let editor: any;
  let surface: HTMLDivElement;
  let body: HTMLDivElement;
  const event = () => new MouseEvent('mousedown', { cancelable: true });
  const select = (element: Node = body) => {
    body.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
  };
  beforeEach(() => {
    surface = document.createElement('div');
    body = document.createElement('div');
    body.contentEditable = 'true';
    body.innerHTML = '<div>First text</div><div>Second text</div>';
    surface.append(body);
    document.body.append(surface);
    // Exercise the real component methods with a live contenteditable, without
    // loading unrelated services, note subscriptions or network requests.
    editor = Object.create(InputComponent.prototype);
    Object.assign(editor, {
      noteMain: new ElementRef(surface), noteBody: new ElementRef(body),
      showTextFormatting: false, showSelectionFormatting: false,
      canFormatText: () => true, shouldUseMobileFormattingBar: () => false,
      scheduleSelectionFormattingUpdate: () => {},
      updateInputLength: jasmine.createSpy(), queueCoEditAutosave: jasmine.createSpy()
    });
    select();
  });
  afterEach(() => {
    window.getSelection()!.removeAllRanges();
    surface.remove();
  });

  it('dismisses with Escape, ignores stale selectionchange and reopens for a new selection', () => {
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeTrue();
    editor.onFormattingKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    editor.updateSelectionFormatting();
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeFalse();
    select(body.firstChild!);
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeTrue();
  });

  it('dismisses outside the toolbar and on collapsed or absent selection', () => {
    editor.updateSelectionFormatting();
    editor.onFormattingPointerdown({ target: body } as unknown as PointerEvent);
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeFalse();
    window.getSelection()!.collapseToEnd();
    editor.updateSelectionFormatting();
    select();
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeTrue();
    window.getSelection()!.removeAllRanges();
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeFalse();
  });

  it('allows a deliberate new gesture to reselect exactly the dismissed range', () => {
    editor.updateSelectionFormatting();
    editor.onFormattingKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    editor.onFormattingPointerdown({ target: body } as unknown as PointerEvent);
    editor.onFormattingPointerup();
    editor.updateSelectionFormatting();
    expect(editor.showSelectionFormatting).toBeTrue();
  });

  it('keeps the explicit A bar usable at a collapsed caret', () => {
    window.getSelection()!.collapseToEnd();
    editor.toggleTextFormatting(event());
    editor.updateSelectionFormatting();
    expect(editor.showTextFormatting).toBeTrue();
    editor.applyTextFormat('bold', event());
    expect(editor.queueCoEditAutosave).toHaveBeenCalled();
  });

  for (const mobile of [false, true]) {
    it(`toggles the A bar and dismisses with Escape/collapse, mobile=${mobile}`, () => {
      editor.shouldUseMobileFormattingBar = () => mobile;
      editor.toggleTextFormatting(event());
      editor.updateSelectionFormatting();
      expect(editor.showTextFormatting).toBeTrue();
      expect(editor.showSelectionFormatting).toBeFalse();
      editor.toggleTextFormatting(event());
      editor.updateSelectionFormatting();
      expect(editor.showTextFormatting).toBeFalse();
      expect(editor.showSelectionFormatting).toBeFalse();
      editor.toggleTextFormatting(event());
      editor.onFormattingKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(editor.showTextFormatting).toBeFalse();
      editor.toggleTextFormatting(event());
      window.getSelection()!.collapseToEnd();
      editor.updateSelectionFormatting();
      expect(editor.showTextFormatting).toBeFalse();
    });
  }

  for (const heading of ['h1', 'h2']) {
    it(`Clear removes inline and ${heading} styles without deleting text and supports native Undo/Redo`, () => {
      body.innerHTML = `<${heading}><b><i><u>Formatted text</u></i></b></${heading}><p>Untouched</p>`;
      select(body.firstChild!);
      const text = body.textContent;
      editor.applyTextFormat('clear', event());
      expect(body.textContent).toBe(text);
      expect(body.querySelector('h1,h2,b,strong,i,em,u')).toBeNull();
      expect(body.querySelector('p')!.textContent).toBe('Untouched');
      expect(window.getSelection()!.toString()).toBe('Formatted text');
      expect(editor.queueCoEditAutosave).toHaveBeenCalled();
      // Clear uses two native editing transactions: both remain undoable.
      document.execCommand('undo');
      document.execCommand('undo');
      expect(body.querySelector(heading)).not.toBeNull();
      expect(body.querySelector('b')).not.toBeNull();
      document.execCommand('redo');
      document.execCommand('redo');
      expect(body.querySelector('h1,h2,b,i,u')).toBeNull();
      expect(body.textContent).toBe(text);
    });
  }

  it('does not format a selection outside this editor', () => {
    const outside = document.createElement('div');
    outside.innerHTML = '<h1>Outside</h1>';
    document.body.append(outside);
    select(outside);
    editor.applyTextFormat('clear', event());
    expect(outside.querySelector('h1')).not.toBeNull();
    expect(editor.queueCoEditAutosave).not.toHaveBeenCalled();
    outside.remove();
  });

  it('Clear preserves unselected inline text and resets all selected heading blocks', () => {
    body.innerHTML = '<h1><b>Before Selected After</b></h1><h2><i>Other heading</i></h2>';
    const textNode = body.querySelector('b')!.firstChild!;
    const range = document.createRange();
    range.setStart(textNode, 7); range.setEnd(textNode, 15);
    body.focus();
    window.getSelection()!.removeAllRanges(); window.getSelection()!.addRange(range);
    editor.applyTextFormat('clear', event());
    expect(window.getSelection()!.toString()).toBe('Selected');
    expect(body.querySelector('h1')).toBeNull();
    expect(body.querySelector('h2 i')!.textContent).toBe('Other heading');
    expect(Array.from(body.querySelectorAll('b')).map(el => el.textContent).join('')).toBe('Before  After');
    select();
    editor.applyTextFormat('clear', event());
    expect(body.querySelector('h1,h2,b,i')).toBeNull();
    expect(body.textContent).toBe('Before Selected AfterOther heading');
    window.getSelection()!.collapseToEnd();
    editor.applyTextFormat('clear', event());
    expect(window.getSelection()!.isCollapsed).toBeTrue();
    expect(body.textContent).toBe('Before Selected AfterOther heading');
  });
});
