# Barvy štítků

Základ: `9ca92d65c59dd7384af539e88dee647badb1772e`. Větev: `personal/label-colors`.

## Implementace

- `LabelI.color?: string` a nullable SQLite sloupec `labels.color` uchovávají barvu štítku. Přiřazení v `notes.labels` zachovává původní ID a název.
- `LabelColorPickerComponent` nabízí 12 pojmenovaných barev. Nativní popover překonává ořezání modalu, podporuje Escape, kliknutí mimo picker a návrat focusu. Tlačítka mají rozměr 44 × 44 px a vybraná barva má zatržítko i `aria-pressed`.
- Řádky štítků se sledují podle ID, takže realtime obnovení nezavře otevřený picker. Editor v sidebaru vybírá barvu před vytvořením i u existujícího štítku. Binderů se změna netýká.
- `SharedService.labelColor()` načítá aktuální barvu z katalogu, nikoliv ze zastaralé kopie v poznámce. Sidebar, karty, editor a nabídky přiřazení používají stejný indikátor.
- Bílý okraj a tmavý vnější prstenec oddělují indikátor od podobného odstínu i obrázku. Další obrys využívá `--note-ink`. Barva uvnitř se nemění podle pozadí.
- `LabelsService` uchovává katalog v cache oddělené podle API serveru a uživatele. Odhlášení cache odstraní. Odpověď požadavku z předchozího účtu nesmí přepsat katalog nového účtu.

## Migrace, API a synchronizace

Start serveru idempotentně přidá `ALTER TABLE labels ADD COLUMN color TEXT`, pokud sloupec chybí. Existující řádky mají `NULL` a UI použije červenou `#e53935`. Migrace nemění ID, názvy ani přiřazení. Starší server může dodatečný sloupec ignorovat.

GET a POST `/api/labels` vracejí dodatečné pole `color`. PATCH `/api/labels/:id` přijímá samotnou barvu a při přejmenování bez pole `color` zachová dosavadní barvu. API povoluje pouze šest hexadecimálních číslic za `#`; `null` nebo prázdný řetězec obnoví výchozí barvu. Autentizace, kontrola vlastníka a MCP oprávnění zůstávají zachované.

Změna odešle uživateli realtime událost `labels-changed`. Klienti znovu načtou katalog; totéž provedou po obnovení spojení. Změna samotné barvy nepřepisuje poznámky. Úplný i přírůstkový synchronizační endpoint přidávají katalog `labels` s barvami. Existující pole a mutace zůstávají zachované. MCP `kept_list_labels` získá barvu přes stávající API; operace podle názvů fungují nadále.

## Import a export

JSON export zachovává původní pole poznámek a doplňuje aktuální barvu do jejich štítků. CSV přidává sloupec `labelColors`. Markdown ZIP přidává soubor `kept-labels.json` s celým katalogem včetně nepoužitých štítků; jednotlivé Markdown soubory obsahují také komentář s metadaty štítků. Záloha SQLite uchová celý katalog beze změny formátu.

Existující import Takeout přijme volitelné `labels[].color` při vytvoření chybějícího štítku. Pokud název již existuje, použije jeho současnou barvu a nepřepíše nastavení uživatele. Google Keep sám toto rozšíření nemusí poskytovat. Stávající exporty JSON/CSV/Markdown tím nezískávají nový univerzální importér.

## Ověření

- `npm run build`: produkční build a PurgeCSS; pouze stávající upozornění Sass. Vložení Google Fonts vyžadovalo přístup k síti.
- Angular v Edge Headless: všech 49 testů, včetně pickeru, sidebaru, služby štítků a dosavadních profilových testů. Místní launcher Edge měl problém s opakováním startu; finální běh použil stejnou Karma/Jasmine sadu s Edge spuštěným přes Playwright a skončil kódem 0.
- `npm run test:labels`: migrace databáze bez sloupce, vytvoření, změna, restart, druhý klient, realtime, sync snapshot a změny, přejmenování, smazání, autorizace, neplatné barvy a import Takeout. Browser test používá skutečný produkční Angular build a izolovaný lokální server/SQLite.
- CSS fixture: 336 kombinací 12 barev, sedmi pozadí, dvou motivů a šířek 360/1280 px; zachování barev a obou oddělujících prstenců.
- `npm run test:personal`: 4 testy včetně dosavadního kontrastu editoru, fontů, HTTP/HTTPS a ukládání poznámek.
- `node --test server/security-runtime.test.js`: 2 testy.
- `npm run test:mcp`: 23 testů.
- `npm run test:sync`, `npm run test:native`, `npm run test:reminders` (10 testů) a `git diff --check`.

Lokální browser test ověřuje vytvoření přes klávesnici, změnu barvy, druhou otevřenou stránku, reload, kartu i editor poznámky, picker v obou motivech a na mobilní šířce, dotyk a JSON export. Lokální screenshoty pickeru byly vizuálně prohlédnuté. Tyto kontroly nenahrazují ověření na `kept-test`.

## Ruční kontrola na kept-test

Po samostatně schváleném nasazení ověřit desktop a skutečný telefon: Tab/Enter/Space/Escape, čtečku obrazovky, dotykové cíle, picker u poslední položky dlouhého seznamu, sbalený sidebar a změnu barvy při otevřeném editoru v druhém klientovi. Zkontrolovat bílé, tmavé, oranžové, růžové a jiné pastelové poznámky i reálné fotografie s různě světlými místy. Ověřit obnovení spojení, reload offline cache a exporty vlastních dat.

V rámci této změny se nic nenasazuje a žádné prostředí se nemění.
