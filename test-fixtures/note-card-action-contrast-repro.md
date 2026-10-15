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
