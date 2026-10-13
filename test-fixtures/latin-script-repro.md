# Latin-script font rendering: manual reproduction

This fixture records text that should render consistently in Kept's UI, including characters from Latin Extended-A and related Latin ranges. It is not an automated test.

## Baseline (before the fix)

On the unmodified `master` build, create a note and a binder/label using the strings below. Check the note title, note body, binder list, label list, and note editor. Certain accented letters appear in a visibly different fallback typeface within the same word.

### Reproduction strings

| Location | Text |
| --- | --- |
| Note title | ČEŠTINA ZLOBÍ |
| Note body | A TADY NE; ĚŠČŘŽÝÁÍÉ; ěščřžýáíé |
| Binder | PŘESKOČIL ŽÁBU |
| Label | Nepřeskočil žábu |

### Additional Latin-script coverage

- Polish: Zażółć gęślą jaźń
- Slovak: Ľúbim ťa, čučoriedka
- Hungarian: Árvíztűrő tükörfúrógép
- German: Grüße, Straße, Äpfel
- French: Éléphant, cœur, façade
- Romanian: Știință, țară, învățământ
- Turkish: Çığ, ıslak, İstanbul
- Nordic: Smörgås, Þjóð, æðri

## Expected result

All characters within a text run use visually consistent typography, including weights and spacing, without unexpected glyph-by-glyph font substitution. Text remains readable in note titles and bodies, binders, labels, and editing views. The intended scope is Latin-script languages, not universal script coverage.

## Investigation and verification

- Inspect the actual character coverage and licensing of the bundled WOFF2 fonts before choosing a replacement or fallback stack.
- Apply the fix at the appropriate shared typography level rather than only to note titles.
- Compare matching before/after views in the authenticated staging app, in light and dark themes.
- Check regression impact on regular English text and application layout.
- Do not treat a local layout mock as a production-equivalent test.

Environment used for the initial report: Linux Mint 22.3 Zena (Cinnamon), Brave Browser 155.1.97.56. The fix has **not** been implemented or verified yet.
