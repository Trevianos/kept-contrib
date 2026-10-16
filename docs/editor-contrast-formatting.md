# Kontrast a formátování editoru

Výchozí commit: `095d80da1a5ec2f1a8a0dd2acc6e4a2843be5dcd`
z `personal/security-docker-build`. Opravná větev:
`personal/editor-contrast-formatting`, vzdálený repozitář pouze `contrib`.

## Změny

- Close, A, placeholdery, checklistové ikony a mobilní ovládání používají
  `--note-ink` skutečné poznámky. Pravidla platí pouze uvnitř
  `app-input .note-main[data-note-ink]`. Kartičky a menu zachovávají své styly.
- Close je tlačítko dostupné klávesnicí. Focus používá barvu poznámky;
  deaktivované akce zůstávají zeslabené. Mobilní SVG používají odpovídající filtr.
- Escape, kliknutí mimo panel a zrušení výběru panel zavřou. Uložený rozsah
  potlačí opožděné události stejného výběru. Nové gesto výběru jej odblokuje.
  Escape panelu má přednost před uložením a zavřením modalu poznámky.
  Tlačítko A funguje i při samotném kurzoru a opakovaným stisknutím panel zavře.
- Clear používá `removeFormat` pro řádkové styly a `formatBlock DIV` pro
  blokové styly. Samotný `removeFormat` v testovaném Chromium ponechává H1/H2.
  Příkazy zachovají obsah, výběr a nativní historii prohlížeče. Clear může
  vytvořit dva kroky Undo/Redo: blokový styl a řádkové styly zvlášť.
  Změna nadpisu platí pro celý dotčený blok, stejně jako H1/H2/Aa.
  Výběr mimo daný editor se nesmí upravit. Zůstává stávající cesta autosave.

Nativní příkazy zachovávají historii editací na rozdíl od přímého přepisování
DOM; viz [MDN execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand).

## Regresní ověření

- Angular spec editoru: Escape, kliknutí mimo, prázdný a nový výběr, opakovaný
  stejný výběr, oba režimy A, Clear H1/H2/B/I/U, částečné a víceblokové výběry,
  kurzor, autosave callback, nativní Undo/Redo a ochrana cizího výběru.
- `test-fixtures/note-contrast.test.cjs`: oba motivy, oranžová/růžová a další
  světlé/tmavé barvy, obrázkové pozadí, editor/kartička, placeholdery,
  checklisty, připnutí, hover/focus/disabled a mobilní SVG. Celkem 40 základních
  kombinací; test mimo editor kontroluje zachování barvy menu.
- `test-fixtures/personal-browser.test.cjs`: skutečný produkční Angular bundle
  se samostatným API a SQLite; výběrový panel, formátování a Clear, desktopové
  A, mobilní kontext s dotykem, uložení/reload, HTTP/HTTPS, fonty, UUID a PWA.
- Bezpečnostní regrese: `server/security-runtime.test.js`, `test:native`,
  `test:mcp`, `test:sync`, `test:reminders`. Backend, MCP, závislosti a Dockerfile
  se proti výchozímu commitu nemění.

## Výsledky lokální validace

Ověřeno 16. 10. 2026 na Windows s Microsoft Edge Headless:

| Kontrola | Výsledek |
| --- | --- |
| Produkční build a PurgeCSS | Prošly; PurgeCSS zachovává stávající konfiguraci s výstupem `[]` |
| Angular/Karma | 43/43, z toho 10 nových regresí editoru |
| `npm run test:personal` | 4/4 včetně 40kombinační CSS matice a produkční aplikace |
| `node --test server/security-runtime.test.js` | 2/2 |
| `npm run test:mcp` | 23/23 |
| `npm run test:reminders` | 10/10 |
| `npm run test:native`, `npm run test:sync` | Prošly |
| `git diff --check` | Prošel |
| Backend, MCP, závislosti a Dockerfile proti výchozímu SHA | Beze změny |

## Ručně na kept-test

1. V obou motivech otevřít oranžovou a růžovou poznámku, checklist a připnutou
   poznámku. Zkontrolovat Close, A, placeholdery, křížky, špendlík a ostatní
   ikony včetně hover, focus a disabled.
2. Vyzkoušet použitá obrázková pozadí. Stávající politika pro obrázky používá
   tmavý inkoust; automatická matice nedokazuje pixelový kontrast každého obrázku.
3. Označit text, použít H1/H2/B/I/U a Clear. Ověřit Escape, kliknutí mimo,
   zrušení výběru, nové označení stejného textu a opakované A. Text nesmí zmizet.
4. Vyzkoušet částečný i víceřádkový výběr, Undo/Redo a psaní po Clear.
   U sdílené poznámky ověřit autosave do druhého okna a obnovu po reloadu.
5. Na skutečném Androidu/iOS ověřit výběrové úchyty, dotykové A/Clear, skrytí
   panelu kliknutím mimo, softwarovou klávesnici a polohu dolní lišty.

Lokální browser testy nenahrazují ověření přihlášené instance `kept-test`.
Tato oprava neprovádí nasazení.
