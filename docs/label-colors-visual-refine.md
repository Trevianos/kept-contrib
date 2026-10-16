# Vizuální úprava barevných Labels

Základ: `3c16195f6e36d31c5ea701b69b36082659cfe3cc`, větev `personal/label-colors-visual-refine`.

## Vzhled

- Sidebar používá vyplněnou tečku 12 px bez prstenců; sbalený sidebar zachovává menší 8px variantu. Upravené vnější rozestupy kompenzují odstraněný původní border, takže text položek zůstává zarovnaný.
- Oranžové zvýraznění aktivního řádku zůstává zachované. Pouze při kontrastu tečky vůči skutečnému podkladu pod 3 : 1 se přidá jeden 1px obrys. Černá nebo bílá barva obrysu se volí podle kontrastu s podkladem.
- Chipy na kartách i v editoru mají celou výplň v barvě štítku a neobsahují puntík. Tvar, typografie a padding zůstávají zachované.
- Text chipu používá černou nebo bílou podle vyššího WCAG kontrastu. Výpočet používá relativní luminanci sRGB a poměr `(Lmax + 0.05) / (Lmin + 0.05)`. Testy ověřují alespoň 4,5 : 1 pro všech 12 barev.
- Chip získá jediný 1px obrys při kontrastu k podkladu pod 3 : 1. Na obrázku jej používá vždy, protože lokální jas fotografie nelze určit z CSS barvy. Přednostně využívá `--note-ink`; jinak zvolí kontrastní černou nebo bílou. Žádné dvojité okraje ani stíny.
- Picker i nabídky přiřazení používají 24px kolečka. Tlačítka pickeru zůstávají 44 × 44 px; řádky přiřazení mají výšku alespoň 44 px. Nabídky podporují také Tab, Enter a Space a oznamují stav přiřazení přes `aria-checked`.
- Paleta 12 barev, výchozí červená, zatržítko, hover/focus, Escape, kliknutí mimo a návrat focusu zůstávají zachované. Odstín ani RGB výplně se nikdy neupravují podle motivu nebo pozadí.

## Rozsah

Prezentační direktiva `LabelAppearanceDirective` a pomocné funkce `label-contrast.ts` upravují pouze CSS. Direktiva sleduje změny skutečného podkladu a motivu; po dokončení CSS přechodu znovu ověří kontrast. Při zániku odpojí pozorování.

Změny zahrnují registraci direktivy, relevantní šablony sidebaru, karet, editoru a hromadného přiřazování, styly Labels a regresní testy. Backend, `LabelI`, SQLite migrace a `labels.color`, služby, API/MCP, synchronizace a import/export jsou vůči výchozímu commitu beze změny. Picker zachovává původní implementaci. Oprava `position: relative` pro tooltip „Formatting options“ zůstává zachovaná.

## Ověření

- Produkční `npm run build` včetně PurgeCSS.
- Celá Angular/Jasmine sada v Edge Headless: 52 testů. Kvůli místnímu chování standardního Edge launcheru byl browser ke Karma připojen přes Playwright.
- Browser fixture: 672 kombinací chipů, 12 barev, bílých/tmavých/oranžových/růžových/pastelových a obrázkových povrchů, motivů, šířek 360/1280 px a karty/editoru. Ověřuje neměnné RGB, kontrast textu a nejvýše jeden obrys. Samostatná matice ověřuje podmíněný obrys aktivního sidebaru proti oranžovému i tmavému podkladu.
- Test produkční aplikace s izolovaným lokálním API/SQLite: výběr klávesnicí a dotykem, ukládání, druhý klient, reload, karta i editor, velikosti pickeru a nabídky přiřazování, motivy a export.
- `npm run test:personal`: 4 testy včetně původního kontrastu editoru a karet. Browser regrese nově ověřuje ukotvení a relativní pozici tooltipu „Formatting options“.
- `git diff --check` a kontrola nulového diffu backendu, modelu a služeb proti výchozímu commitu.

Lokální screenshoty pickeru a chipu byly vizuálně zkontrolované. Lokální browser test s dotykovým vstupem nenahrazuje kontrolu na skutečném telefonu.

## Ručně na kept-test

Po samostatném schválení nasazení ověřit oba motivy na desktopu a telefonu, dlouhé názvy, sbalený sidebar, všechny aktivní barvy vůči oranžovému podkladu, skutečné fotografie a pastelové poznámky, čtečku obrazovky, dotykové ovládání, návrat focusu a tooltip formátování. Ověřit také změnu barvy z druhého klienta při otevřeném editoru.

V této práci se žádné prostředí nemění a nic se nemerguje.
