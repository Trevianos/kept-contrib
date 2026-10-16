# Osobní edice Kept: integrace a ruční testy

Stav k 16. 10. 2026: zdrojová integrace je kandidát pro **ruční testy v izolovaném `kept-test`** s testovacími daty a omezeným síťovým přístupem. Není schválena pro produkci. Docker build ani skutečné stagingové prostředí nebyly v tomto workspace dostupné. Produkční VM, kontejnery a Compose nebyly použity ani změněny.

## Základ a dohledatelnost

Větev `personal/integration` vznikla z aktuálního masteru `ericerkz/kept`, ověřeného přes Git fetch: `50619c520c2506ad351a43e25e3183ba6847a291`. Publikuje se pouze do remote `contrib` (`Trevianos/kept-contrib`). Každé PR má samostatný merge commit; všechny uvedené hlavy jsou předky integrační větve. Původní větve ani jejich historie se nepřepisují.

| PR | Zdrojová větev | Přesná hlava PR | Merge commit | Výsledek |
| --- | --- | --- | --- | --- |
| #93 | `fix/pinned-icon-outline` | `650a850c6e7fb4da33133a2bbb000b716dd09b81` | `3393a9e` | Jedna obrysová ikona připnutí |
| #94 | `fix/sidebar-scroll` | `915d76db073418225169363be64224bcf35bc012` | `7e49025` | Posouvání celého sidebaru, nezávislé skládání Binders/Labels |
| #95 | `fix/latin-character-rendering` | `75710d33676657d897411c3c28162fd50a68bb12` | `f4ca91e` | Lokální Kept Sans v běžném i kurzivním řezu |
| #100 | `fix/sidebar-active-unicode` | `b5525b1b12f63d578f72e67a61a506c0d6e5ce5d` | `ddf0465` | Přesné aktivní položky podle Angular Routeru |
| #101 | `fix/note-card-actions-contrast` | `ec1c39d3771761332b739b83801ce3faf3fd672b` | `cd5d04e` | Kontrast ovládání, příloh, připomínek a náhledů podle povrchu poznámky |
| #102 | `fix/profile-navigation-cleanup` | `6d2227581fc732e20c4f6c75a9bcee26f1d86354` | `52a7f30` | Jednoduché profilové menu, editace profilu v Settings, zachované role |

Referenční zadání a ZIP pocházejí z `contrib/personal/customizations` na `bcd516c`. Integrační větev tuto referenční větev nemerguje. ZIP, historický patchovací Dockerfile a produkční override nejsou součástí výsledku. Přesný seznam přidaných, upravených a odstraněných souborů proti základu je v [personal-integration-files.txt](personal-integration-files.txt).

## Vyřešené překryvy

- `sidenav.component.html`: seznam Labels zachovává skládací sekci z #94 a současně používá `routerLinkActive` s přesnou shodou z #100. Nevrací se starý vnořený scroll ani zaniklé obslužné metody. Totéž zvýraznění zůstává u Binders.
- `link-preview.component.scss`: název odkazu používá `--note-ink` z #101 a Kept Sans z #95.
- `navbar.component.scss`: starý formulář v profilovém menu nahradila navigace z #102. Nové menu používá Kept Sans a vlastní ikonový font. Neponechávají se styly odstraněného formuláře.
- Automatické sloučení `settings`, `styles.scss` a zbývajících částí `sidenav` bylo zkontrolováno. Test očekávající původní Google Sans nyní očekává Kept Sans. Test routeru už nemockuje lifecycle metodu odstraněnou v #94.
- Produkční Arial fallback pro názvy poznámek není převzat: lokální Kept Sans pokrývá české znaky a sjednocuje navigaci, karty i editor. Arial je záměrně pouze v wordmarku.

## Produkční úpravy ve zdrojích

`src/styles.scss` definuje `--kept-accent: #FFA726`. Tento token ovládá dřívější akcent `#feefc3` v navigaci, tlačítku nové poznámky a toastu. Barvy uložených poznámek ani ostatní palety se nepřepisují. Barva manifestu a HTML metadat je také `#FFA726`; tyto statické soubory CSS proměnné nevyhodnocují.

Wordmark v navbaru, přihlášení a mobilním sidebaru má Arial/Helvetica/sans-serif, váhu 600, velikost 26 px, řádkování 1.2, nulový rozestup a žádný textový stín. Navbar nemá původní posun nahoru. Zdrojové místo pro změnu jsou příslušné bloky `.text`, `.brand-row span` a `.branding-text`.

Logo, favicon a PWA ikony jsou přímé kopie původních souborů. Oba výchozí Apple odkazy nyní používají skutečnou 180px ikonu. Manifest zachovává 192/512px varianty i jejich deklarované účely. Push service worker se dál kopíruje standardním Angular buildem.

`src/uuid-polyfill.ts` se importuje ze startup souboru `src/polyfills.ts`. Pokud nativní `crypto.randomUUID` existuje, funkce ho zachová. Jinak vytvoří UUID v4 pomocí `crypto.getRandomValues`, včetně bitů verze a varianty. Nepoužívá `Math.random` ani objekt `window`; může běžet i ve worker globálu. Samostatný worker musí tento modul importovat, pokud fallback potřebuje. Upstream push worker UUID negeneruje a zůstává beze změny. Bez bezpečného zdroje náhodných bytů se slabší generátor nedoplňuje.

Dockerfile zůstává standardní dvoufázový build ze zdrojů. Neobsahuje přepisování `dist/keep` ani závislost na `kept-fontfix:local`. `.dockerignore` navíc vylučuje reference, dočasné testy, `.env` a databázové soubory. Výsledný runtime stále používá `/app/data`, původní entrypoint, PUID/PGID a serverové moduly. Skutečné Compose soubory se nemění.

## Branding: původ a SHA-256

ZIP byl přečten přímo z referenčního Git objektu. Kontrola odmítá jinou sadu než přesně pět očekávaných souborů. Stejné hashe a rozměry ověřuje `test-fixtures/personal-assets.test.cjs` ve zdrojích i v sestaveném výstupu.

| Původní soubor | Zdrojový cíl | SHA-256 |
| --- | --- | --- |
| `kept-logo-128.png` | `src/assets/images/keep2x.fw.png` | `73dc6efed7b8e2b403a8c39d93cb3a789fdacf72599cc70cb98c7d75d8907b1d` |
| `kept-icon-180.png` | `src/assets/images/kept-icon-180.png` | `70001c6a3ebfba37a0a30961d13d6603c9408f4614d85a84de9afc3746c47c60` |
| `kept-icon-192.png` | `src/assets/images/kept-icon-192.png` | `bf48fa0f31712e2062174e4a2b3e03871afe02849a7c619198d06787742477a7` |
| `kept-icon-512.png` | `src/assets/images/kept-icon-512.png` | `66d5595080cd46e9d1f22cb07b31fe0db17bef2a89ea790d8060f78e20c7dd4b` |
| `favicon.ico` | `src/favicon.ico` | `5865477f1cc068182ec13d1e6ddfe76ae7f8fa71652ff3ee75a8ab1fb2a0af71` |

## Reprodukce kontrol

Použijte Node.js 24 a npm podle `package.json`. Spouštějte příkazy v kořeni checkoutu integrační větve:

```sh
npm ci
npx playwright install chromium
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
npm run test:personal
npm run test:sync
npm run test:native
npm run test:reminders
npm run test:mcp
git diff --check
```

Karma potřebuje `CHROME_BIN` ukazující na spustitelný Chrome/Chromium. V tomto Windows prostředí prošel Playwright `chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe`. Pro `test:personal` se standardně použije Chromium instalované Playwrightem. Volitelná proměnná `KEPT_BROWSER_CHANNEL=msedge` použije Edge, pokud ho systém podporuje.

Build potřebuje síť pro vložení Material Symbols z Google Fonts. Snackbar má nadále původní CDN odkazy. Lokální Kept Sans tuto síť pro vykreslení textu nepotřebuje. Čistý Docker build potřebuje síť také pro základní image, npm a Alpine balíčky.

Backendové integrační testy nyní izolují nejen SQLite, ale celý `DATA_DIR`, včetně příloh a VAPID klíčů. Po ukončení vlastního serveru smažou svůj dočasný adresář. Windows cesta k repozitáři v OAuth/OIDC testech používá `fileURLToPath`.

## Naměřené výsledky a omezení

| Kontrola | Výsledek |
| --- | --- |
| `npm run build` | Prošel; produkční Angular bundle přibližně 1.72 MB, pouze stávající Sass deprecation warnings |
| Čistá kopie zdrojů bez původního `node_modules` | `npm ci`, následný produkční build i `npm run test:sync` prošly; ověřeno také načtení nativního SQLite modulu skutečným API testem |
| PurgeCSS | Příkaz prošel, vrací `[]`: upstream konfigurace je zakomentovaná a nic neodstraňuje. Integrace tento stav zachovává. Testovaný výstup proto nemá nově ořezané dynamické CSS. |
| Angular/Karma | 33/33 prošlo v Chromium headless shellu: Unicode router, skládání/scroll sidebaru, profil, role, oba motivy Settings, UUID a IndexedDB outbox |
| `npm run test:personal` | 4/4 prošlo: kontrastní CSS matice, zdrojové i sestavené assety, UUID v globálu bez `window`, skutečná sestavená aplikace |
| HTTP aplikace | Kontext `isSecureContext=false`, česká poznámka uložena UI do samostatné SQLite a načtena po reloadu; fallback je dostupný před Angular službami |
| HTTPS aplikace | Nativní UUID zachováno; skutečný web worker vytvořil UUID; PWA service worker se zaregistroval a odregistroval |
| Branding a fonty v browseru | Požadovaný wordmark v obou motivech, načtený běžný i kurzivní lokální Kept Sans, žádná JavaScript page error |
| `npm run test:sync` / `test:native` | Obě sady prošly |
| `npm run test:reminders` | 10/10 prošlo |
| `npm run test:mcp` | 23/23 prošlo, včetně OAuth, OIDC, oprávnění a stdio handshake |
| Skutečná WOFF2 data | fontTools: běžný řez 551 znaků, kurzivní 550; kontrolovaný český a další latinkový text bez chybějících znaků; váhy 400–700 |
| `git diff --check` | Prošel proti upstream základu i pro doplněné změny |
| Docker image build/run | **Neproveden:** Docker CLI/runtime zde není dostupný. Dockerfile byl zkontrolován staticky. |
| Ruční mobilní/PWA/staging testy | **Neprovedeny** na skutečných zařízeních ani na `kept-test` |

HTTPS test používá jednorázový lokální certifikát a v testovacím browseru důvěřuje pouze jeho veřejnému klíči. Neověřuje veřejný certifikát, reverse proxy, WSS ani push doručení stagingu. Kontrastní fixture používá skutečné SCSS a Angular zapouzdření, ale nenahrazuje ruční kontrolu všech poznámek a motivů v přihlášené aplikaci.

Při prvních pokusech selhal build kvůli blokované síti a Karma launcher Edge/úplného Chromium kvůli prostředí. Finální build i Angular běh výše prošly. První verze nového UUID testu měla chybné jméno pole `title`; opraveno na skutečné `noteTitle`. Původní backendové testy na Windows selhaly kvůli URL cestám a předčasnému mazání SQLite; opravené sady prošly. První HTTPS test blokoval service worker kvůli samopodepsanému certifikátu; finální test používá omezenou důvěru jeho klíči.

Audit `npm audit --omit=dev` hlásí **22 nálezů: 8 moderate, 10 high, 4 critical**. Produkční verze v lockfile se touto integrací nemění. Kritické položky hlášené auditem jsou `concurrently`, `proxy-addr`, `shell-quote` a `tar`. Celý strom včetně vývoje hlásí 60 nálezů (2 low, 17 moderate, 35 high, 6 critical). Dosažitelnost jednotlivých zranitelností nebyla vyhodnocena. Automatický `npm audit fix` nebyl použit, protože by smíchal tuto integraci s aktualizací závislostí. Před produkčním nasazením musí následovat samostatná oprava nebo doložené vyhodnocení těchto nálezů.

## Licence

`LICENCE.MD` zůstává beze změny: obsahuje licenci Kept AGPL-3.0-only a původní atribuci MIT projektu. Chybějící úplný MIT notice byl přidán do `src/assets/licenses/google-keep-clone-MIT.txt` přímo z [původního repozitáře na ověřeném commitu](https://github.com/aBrihoum/google-keep-clone/blob/66a111496f2011c975bff77f4144a4fc8c96ff81/LICENSE.md). Build jej kopíruje spolu s assety.

Fonty z #95 mají zachované `OFL.txt`, `TRADEMARKS.txt` a popis původu. Kontrola interních WOFF2 metadat potvrdila rodinu Kept Sans a SIL OFL 1.1. Testovací Playwright a selfsigned jsou pouze vývojové závislosti; Docker runtime používá `npm ci --omit=dev`. Branding je původní materiál dodaný vlastníkem pro tuto osobní edici.

## Ruční testování na `kept-test`

1. Na samostatném stroji nebo v samostatném checkoutu ověřte SHA a proveďte čistý build nového image. Nepoužívejte produkční Compose ani produkční svazek. Image označte plným Git SHA, zaznamenejte jeho image ID/digest a uložte log buildu. Například `docker build --pull -t kept-personal:<git-sha> .` pouze image sestaví.
2. Vytvořte samostatný stagingový `DATA_DIR`/svazek připojený do `/app/data`. Použijte testovací prostředí a vlastní port/doménu. Případná data z produkce musí být konzistentní záloha zkopírovaná do nového umístění; staging nesmí připojit původní adresář. Vypněte nebo nahraďte produkční push, OIDC a jiné externí integrace testovacími údaji.
3. Ověřte přihlášení administrátora i běžného uživatele. Avatar musí otevřít menu; Settings musí fungovat oběma. Users smí vidět a přímo otevřít jen administrátor. Ověřte Escape, kliknutí mimo menu a odhlášení. V Settings otestujte jméno, upload/odebrání avatara, preset a změnu hesla včetně chybných hodnot.
4. Naplňte Binders a Labels dlouhými seznamy. Ověřte dostupnost spodních položek posouváním celého sidebaru, nezávislé skládání, počet položek, ovládání klávesnicí a uchování stavu po reloadu. Vyzkoušejte prázdné sekce, šířku 1280 px i mobilní šířku kolem 390 px a nativní mobilní drawer, pokud jej používáte.
5. Otevřete položky `Dům a zahrada`, `České poznámky`, `Úkoly doma` a `Znaky / ? # % +`. Aktivní musí být právě zvolený Binder/Label i po reloadu přímého odkazu. Podobné názvy se nesmí zvýraznit současně.
6. V obou motivech ověřte české texty na kartách, v novém i existujícím editoru, profilovém menu a Settings. Použijte `Příliš žluťoučký kůň úpěl ďábelské ódy. ČĎĚŇŘŠŤŮŽ čďěňřšťůž`. Zkontrolujte DevTools Network: oba KeptSans WOFF2 mají stav 200 a odpovídají této verzi. Wordmark musí být oranžový, 26 px a bez stínu.
7. U připnuté i nepřipnuté poznámky zkontrolujte jediný symbol špendlíku, hover a otevřený editor. Na světlých/tmavých barvách i obrázkových pozadích zkontrolujte ikony akcí, aktivní/minulou připomínku, deaktivované akce, názvy příloh a náhledy odkazů. Použijte také existující scénáře v `test-fixtures/`.
8. Na skutečném LAN HTTP ověřte uložení, reload a editaci poznámky i přílohy. Na HTTPS ověřte přihlášení, uložení, WSS synchronizaci mezi dvěma okny, offline frontu a opětovné připojení. HTTP fallback neodstraňuje požadavky browseru na HTTPS pro push a další zabezpečené API.
9. Na Androidu a iOS zkontrolujte favicon, instalaci PWA, 192/512px ikony, Apple 180px ikonu, start aplikace a upgrade existující instalace. Ověřte push s povolením uživatele a skutečné doručení připomínky. Vyzkoušejte studený start i návrat z pozadí.
10. Přes testovací MCP připojení ověřte čtení, vytvoření/úpravu poznámky, přílohy, uzamčené poznámky a odebrání přístupu. Zkontrolujte persistence po restartu pouze stagingového kontejneru, práva PUID/PGID, logy a mount `/app/data`.

## Pozdější upgrade a návrat

Tyto poznámky neautorizují nasazení. Produkční změna musí být samostatný krok po ručních testech, úspěšném čistém Docker buildu a vyhodnocení bezpečnostního auditu.

- Před změnou zachovejte přesný starý image `kept-fontfix:local` včetně image ID/digest a případně exportu `docker save`. Nepřepisujte jeho tag novým buildem. Nový image publikujte pod neměnným SHA tagem a při spouštění preferujte digest.
- Zálohujte SQLite konzistentním způsobem (online backup nebo při zastavených zápisech); obyčejné kopírování otevřeného SQLite bez WAL může ztratit transakce. Se stejným bodem obnovy zálohujte celý `/app/data`, tedy přílohy, obrázky, VAPID a další konfiguraci. Ověřte obnovu v samostatném stagingu.
- Uchovejte původní Compose, prostředí, tajné údaje mimo Git, mapování portů, `/app/data` a PUID/PGID. Zachovejte také `SQLITE_PATH`, pokud je v instanci nastaven. Před přechodem porovnejte skutečná nastavení s novým image.
- Při návratu zastavte novou instanci a zvolte zachovaný image `kept-fontfix:local`/jeho digest s původním prostředím. Pokud se databáze nebo její schéma změnily, obnovte společně předchozí SQLite, přílohy i konfiguraci ze stejné zálohy; starý image nesmí naslepo používat potenciálně nekompatibilní databázi. Ověřte přihlášení, staré poznámky, přílohy a zápis.
