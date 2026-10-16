const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const sass = require('sass');
const { chromium } = require('playwright');
const css = sass.compile('src/styles.scss', { logger: sass.Logger.silent }).css;
const source = fs.readFileSync('src/app/components/label-color-picker/label-color-picker.component.ts', 'utf8');
const colors = [...source.matchAll(/\['\w+', '(#[0-9a-f]{6})'\]/g)].map(m => m[1]);

test('label identity and separating rings across themes, pastel colors, images and mobile widths', async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  let combinations = 0;
  try {
    const page = await browser.newPage();
    for (const width of [360, 1280]) for (const theme of ['light', 'dark']) {
      await page.setViewportSize({ width, height: 800 });
      for (const surface of ['#ffffff', '#202124', '#fbbc04', '#f4b8c9', '#f4cccc', '#d7aefb', 'linear-gradient(45deg,#000 25%,#fff 25%,#e53935 70%,#1e63d5 70%)']) {
        await page.setContent(`<style>${css}</style><body class="${theme}-theme"><section data-note-ink="${theme === 'light' ? 'dark' : 'light'}" style="padding:30px;background:${surface};--note-ink:${theme === 'light' ? '#202124' : '#e8eaed'}">${colors.map(color => `<span class="label-color-dot" style="background-color:${color}"></span>`).join('')}</section></body>`);
        const dots = await page.locator('.label-color-dot').evaluateAll(els => els.map(el => {
          const style = getComputedStyle(el), rect = el.getBoundingClientRect();
          return { bg: style.backgroundColor, border: style.borderTopColor, shadow: style.boxShadow, radius: style.borderRadius, width: rect.width, right: rect.right };
        }));
        assert.equal(dots.length, 12);
        dots.forEach((dot, i) => {
          const rgb = colors[i].match(/\w\w/g).map(v => parseInt(v, 16));
          assert.equal(dot.bg, `rgb(${rgb.join(', ')})`);
          assert.equal(dot.border, 'rgb(255, 255, 255)');
          assert.match(dot.shadow, /rgb\(32, 33, 36\)/);
          assert.equal(dot.radius, '50%');
          assert.equal(dot.width, 16);
          assert.ok(dot.right <= width);
        });
        combinations += colors.length;
      }
    }
    console.log(`${combinations} label/surface/theme/viewport combinations verified`);
  } finally { await browser.close(); }
});
