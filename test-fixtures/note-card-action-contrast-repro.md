# Note-card actions, reminders, link previews, and attachments: contrast regression cases

## Current behavior

In dark theme, toolbar action icons on colored note cards become pale gray (defined globally by `body:not(.light-theme) .icons-container .icons > div::after`), even when the card is a light pastel color. Icons can become difficult to see. The same card in light theme has darker, readable icons.

Reminder chips likewise use fixed yellow or gray text/background colors rather than accounting for the note's actual background. Their clock image is a black external SVG, and the active reminder icon uses a fixed yellow fill.

Link preview cards use fixed colors for title, domain, and action buttons (including theme-wide light/dark overrides); these can clash with the actual note background. Attachment cards similarly hard-code secondary text, icons, and download controls, particularly on light colored cards in dark theme.

## Expected behavior

- Action icons on each note card have readable contrast against the *card's actual background*, independent of whether the app uses light or dark theme.
- Reminder chip text, background and clock icon remain legible on light pastel and dark note-card colors, including past reminders.
- An active reminder indicator remains identifiable and readable.
- Inline and visual-mode link previews maintain readable title/domain text, links/buttons, border and hover in both themes on note colors, without degrading other surfaces where the component is used.
- Attachment previews show readable filename, size, type icon, and download/remove controls both on the card and in the opened note, where applicable.
- Neutral notes preserve a sensible theme-dependent appearance; background-image notes degrade gracefully.
- Preserve hover, disabled, selected, and touch behaviors.
- Do not inadvertently recolor menus, editor tools, other surfaces, or icons outside note cards.

## Reproduction / validation matrix

| App theme | Card background | Check |
| --- | --- | --- |
| Light | Default uncolored | Existing readability retained |
| Dark | Default uncolored | Existing readability retained |
| Light | Light lavender / cream / mint | Dark actions and legible reminder chip |
| Dark | Light lavender / cream / mint | Same strong contrast as in light theme |
| Light | Dark red / navy / green | Light actions and legible reminder chip |
| Dark | Dark red / navy / green | Light actions and legible reminder chip |
| Both | Background image | Legible where possible without altering content |
| Both | Past reminder | Muted but readable |
| Both | Active reminder | Identifiable indicator without washed-out accent |
| Both | Link previews on light and dark cards | Title, domain, icon and click targets remain legible |
| Both | Attachments on light and dark cards | Filename, metadata and actions remain legible |
| Both | Open note editor | Link/attachment styling still readable; no regressions |

Include screenshots before and after implementation. Automated checks and authenticated staging verification to be recorded in the PR.


## Implementation validation (2026-10-15)

- Cards pass `noteTextColor(note)` through `--note-ink` on colored/image surfaces. Uncolored surfaces keep theme defaults. The editor uses its existing equivalent foreground selection and clears contrast metadata on reset; external background updates refresh it too.
- Scoped overrides cover action masks, active alarm underline, current/past reminder chips and clock images, attachment metadata/actions, and link controls. Link previews use inherited variables with existing defaults outside these surfaces.
- Run the CSS regression fixture with `node --test test-fixtures/note-contrast.test.cjs`. Requires `sass`, Angular compiler, Playwright (resolvable directly or through `NODE_PATH`), and installed Microsoft Edge. No dependency or lockfile changes are required by the application.
- Fixture passed: 32 combinations (2 themes x 8 backgrounds x card/editor), with pastel yellow/mint/lavender, dark red/navy/green, neutral and bundled groceries image. Checks computed foreground colors, palette text contrast >= 4.5:1, reminder hover, disabled opacity and unchanged toolbar styling outside notes. Uses Angular CSS encapsulation. This is a CSS fixture, not an authenticated Angular application test.
- `npm run build`: passed, including PurgeCSS; existing Sass import deprecation warnings remain. Font inlining required network access to Google Fonts.
- `npm run test:reminders`: 10 passed. `npm run test:native`: passed.
- `npm run test:mcp`: 21 passed, 2 failed (`oidc-link`, `remote-oauth`); both processes abort in Node's `InternalCallbackScope::Close` with `execution_async_id` assertion. Reproduced with those two files alone and `--test-concurrency=1`.
- `npm run test:sync`: assertions passed, process exited 1 during temporary SQLite cleanup (`EPERM` on Windows); reproduced twice. `git diff --check`: passed.
- Still requires manual verification on isolated `kept-test`: actual rendered cards/editor, screenshots before/after, touch/selection behavior, real link thumbnails, attachment download/remove, reminder interaction, and arbitrary image content. Image fixture checks CSS inheritance only; it does not establish pixel contrast across an image. Existing dark-text policy for image backgrounds remains unchanged.
