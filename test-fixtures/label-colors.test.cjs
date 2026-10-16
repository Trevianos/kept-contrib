const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const sass = require('sass');
const ts = require('typescript');
const { chromium } = require('playwright');
const css = sass.compile('src/styles.scss', { logger: sass.Logger.silent }).css;
const source = fs.readFileSync('src/app/components/label-color-picker/label-color-picker.component.ts', 'utf8');
const colors = [...source.matchAll(/\['\w+', '(#[0-9a-f]{6})'\]/g)].map(m => m[1]);
const compile = file => ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true } }).outputText;
const contrastCode = compile('src/app/utils/label-contrast.ts');
const directiveCode = compile('src/app/directives/label-appearance.directive.ts');
const rgb = hex => `rgb(${hex.slice(1).match(/../g).map(v => parseInt(v, 16)).join(', ')})`;

async function paint(page, mode) {
  await page.evaluate(({ contrastCode, directiveCode, mode }) => {
    const helpers = {}, directives = {};
    new Function('exports', contrastCode)(helpers);
    new Function('exports', 'require', directiveCode)(directives, name => name.includes('label-contrast') ? helpers : { Directive: () => x => x, Input: () => () => {} });
    window.appearances = [...document.querySelectorAll('[data-label-color]')].map(el => {
      const directive = new directives.LabelAppearanceDirective({ nativeElement: el }, { setStyle: (host, key, value) => host.style.setProperty(key, value) }, { runOutsideAngular: fn => fn() });
      directive.appLabelAppearance = mode; directive.labelColor = el.dataset.labelColor; directive.ngAfterViewInit();
      return directive;
    });
  }, { contrastCode, directiveCode, mode });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test('label chips: unchanged identity, WCAG text and one conditional boundary on 672 surface combinations', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let combinations = 0;
  try {
    const page = await browser.newPage();
    const helpers = {}; new Function('exports', contrastCode)(helpers);
    const image = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath fill='white' d='M0 0h40v40H0z'/%3E%3Cpath fill='black' d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/svg%3E")`;
    for (const width of [360, 1280]) for (const theme of ['light', 'dark']) for (const editor of [false, true]) {
      await page.setViewportSize({ width, height: 800 });
      for (const surface of ['#ffffff', '#202124', '#ffa726', '#f4b8c9', '#f4cccc', '#d7aefb', image]) {
        await page.setContent(`<style>${css}</style><body class="${theme === 'light' ? 'light-theme' : ''}"><section class="${editor ? 'note-main' : 'note-container'}" style='padding:30px;background:${surface};--note-ink:${theme === 'light' ? '#202124' : '#e8eaed'}'><div class="labels-container">${colors.map(color => `<div class="label-container label-color-chip" data-label-color="${color}"><div class="label"><span>Work</span><span class="cancel-icon"></span></div></div>`).join('')}</div></section></body>`);
        await paint(page, 'chip');
        const chips = await page.locator('.label-color-chip').evaluateAll(els => els.map(el => {
          const s = getComputedStyle(el); return { bg: s.backgroundColor, text: s.color, border: s.borderTopWidth, shadow: s.boxShadow, outline: s.outlineWidth, outlineStyle: s.outlineStyle, image: s.backgroundImage, dot: el.querySelector('.label-color-dot') !== null };
        }));
        chips.forEach((chip, i) => {
          assert.equal(chip.bg, rgb(colors[i])); assert.equal(chip.image, 'none'); assert.equal(chip.dot, false);
          assert.ok(['rgb(0, 0, 0)', 'rgb(255, 255, 255)'].includes(chip.text));
          assert.ok(helpers.labelContrast(colors[i], chip.text === 'rgb(0, 0, 0)' ? '#000000' : '#ffffff') >= 4.5);
          assert.equal(chip.border, '0px'); assert.equal(chip.shadow, 'none');
          assert.ok(chip.outlineStyle === 'none' || chip.outline === '1px');
          if (surface === image) assert.equal(chip.outline, '1px');
        });
        combinations += colors.length;
      }
    }
    console.log(`${combinations} chip/color/surface/theme/viewport/editor combinations verified`);
  } finally { await browser.close(); }
});

test('sidebar dots have no rings, except one low contrast active outline based on actual row color', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage();
    const utils = {}; new Function('exports', contrastCode)(utils);
    for (const theme of ['light', 'dark']) for (const active of [false, true]) for (const surface of ['#ffa726', '#202124']) {
      await page.setContent(`<style>${css}.item .label-color-dot{width:12px;height:12px}</style><body class="${theme === 'light' ? 'light-theme' : ''}">${colors.map(color => `<div class="item ${active ? 'active' : ''}" style="background:${surface}"><span class="label-color-dot" data-label-color="${color}"></span></div>`).join('')}</body>`);
      await paint(page, 'sidebar');
      const dots = await page.locator('.label-color-dot').evaluateAll(els => els.map(el => { const s = getComputedStyle(el); return {bg:s.backgroundColor,border:s.borderWidth,shadow:s.boxShadow,outline:s.outlineStyle,outlineColor:s.outlineColor,width:s.width}; }));
      dots.forEach((dot, i) => {
        assert.equal(dot.bg, rgb(colors[i])); assert.equal(dot.border, '0px'); assert.equal(dot.shadow, 'none'); assert.equal(dot.width, '12px');
        const low = utils.labelContrast(colors[i], surface) < 3;
        assert.equal(dot.outline, active && low ? 'solid' : 'none');
        if (active && low) assert.equal(dot.outlineColor, rgb(utils.labelTextColor(surface)));
      });
    }
  } finally { await browser.close(); }
});
