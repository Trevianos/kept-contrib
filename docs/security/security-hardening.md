# Bezpečnostní audit osobní edice Kept

Datum: 16. 10. 2026. Základ: `personal/integration`, commit `5651c7ac331e0bbcb3e2685a0109588880cf4e97`. Výsledná větev: [personal/security-hardening](https://github.com/Trevianos/kept-contrib/tree/personal/security-hardening). Cílový remote je pouze `contrib` (`Trevianos/kept-contrib`).

## Výsledek a hranice ověření

`npm audit --omit=dev` klesl z **22 na 0**: critical 4 → 0, high 10 → 0, moderate 8 → 0. Audit zahrnující devDependencies klesl z **60 na 15**: critical 6 → 0, high 35 → 11, moderate 17 → 4, low 2 → 0. Zbývající nálezy jsou jednotlivě vyhodnoceny níže. Výsledek auditu platí pro aktuální databázi advisory, není zárukou nepřítomnosti dalších chyb.

Výchozí audit byl reprodukován z nezměněného lockfile na Windows, nikoli přístupem do původního kontejneru. Jeho 22 balíčků a počty přesně souhlasí s dodaným Docker auditem. Docker zde není nainstalován; čistý Linux/Alpine image build, entrypoint, PUID/PGID ani skutečné prostředí `kept-test` zde nebyly ověřeny. Na VM 104 se nic nenasazovalo. Master, integrační větev ani původní PR se nemění.

Strojové důkazy: [runtime před](audit-before.json), [runtime po](audit-after.json), [celý strom před](audit-all-before.json), [celý strom po](audit-all-after.json). JSON obsahuje přesné advisory, jejich závažnosti, rozsahy a dependency cesty. [Rozpis 65 advisory záznamů](advisories.md) uvádí opravené použité verze a odkazy na každou advisory. Některé záznamy se sdílejí mezi Angular balíčky; 22 nálezů není 22 unikátních CVE.

## Dependency tree a produkční runtime

Byl zkontrolován celý lockfile včetně transitivních hran a příznaků `dev`/`optional`, výstup `npm ls --all`, `npm explain` pro napadené řetězce, importy v `src`, `server` a `mcp`, npm skripty a obě fáze Dockerfile. Autoritou pro verze je commitovaný lockfile; existující node_modules byly následně nahrazeny čistým `npm ci`.

Docker builder používá plné `npm ci` a sestaví `dist/keep`. Finální fáze provádí nové `npm ci --omit=dev` a kopíruje pouze server, MCP a hotový frontend. Node server obsluhuje statický frontend; neprovádí Angular SSR ani frontendový build.

| Skupina | Přímé závislosti | Důvod |
| --- | --- | --- |
| Node runtime, zachováno | `@modelcontextprotocol/sdk`, `adm-zip`, `cors`, `express`, `multer`, `openid-client`, `otplib`, `qrcode`, `sanitize-html`, `sqlite3`, `unzipper`, `web-push`, `ws`, `zod` | API, SQLite, autentizace, importy, realtime, push a MCP tyto balíčky importují nebo používají. |
| Frontend, přesunuto do devDependencies | Osm původních `@angular/*`, `@capacitor/core`, `@popperjs/core`, `bricks.js`, `jszip`, `node-snackbar`, `rxjs`, `timepicker-ui`, `tslib`, `zone.js` | Jsou potřebné při sestavení browserového JS/CSS. Jejich výsledný kód či assety zůstávají v dist. Nepotřebují další kopii v node_modules finálního kontejneru. |
| Typy, přesunuto do devDependencies | `@types/jszip` | Typové deklarace pro kompilaci. |
| Vývoj, přesunuto a opraveno | `concurrently` | Používá jej jen `npm start`, který spouští nodemon a ng serve. Oba již vyžadují devDependencies. Docker spouští přímo `node server/server.js`. |
| Build/test, již devDependencies | Angular CLI/build/compiler-cli, TypeScript, Karma/Jasmine, Playwright, selfsigned, PurgeCSS, nodemon, webpack-bundle-analyzer | Zachovány pro build a regresní testy. |
| Instalační transitivní závislosti v runtime stromu | `sqlite3 → tar`, volitelný/peer `node-gyp → tar, undici` | SQLite vyžaduje nativní instalaci. Balíčky se nemažou ani násilně nevynechávají; jsou opraveny v rámci jejich povolených rozsahů. Server nepřijímá TAR a neimportuje npm undici. Node vestavěný fetch je samostatná součást Node.js, tento audit ji nehodnotí. |

Počet produkčních dependency záznamů podle npm metadata klesl 322 → 274. Nejde o velikost image ani důkaz odstranění frontendového kódu. Samotný přesun by neopravoval zranitelnosti browserového bundlu; proto byl Angular současně aktualizován a zkontrolován i plný audit.

## Všech 22 původních nálezů

Závažnost je původní hodnota npm audit, včetně přenesených nálezů. Dosažitelnost vychází ze zdrojového kódu a testů; proti původní aplikaci nebyl prováděn destruktivní exploit.

| Balíček | Původní závažnost | Zamčeno před → po | Použití, dosažitelnost a řešení |
| --- | --- | --- | --- |
| `@angular/animations` | moderate | 21.2.12 → 21.2.25 | Přenesený nález core. Aktualizace celé frameworkové sady, přesun instalace do build fáze. |
| `@angular/common` | high | 21.2.12 → 21.2.25 | Browser používá DatePipe s pevnými formáty; útočníkem řízený digitsInfo/formát nebyl nalezen. SSR HttpTransferCache se nepoužívá. Opraveny i všechny uvedené cache/format advisory. |
| `@angular/compiler` | high | 21.2.12 → 21.2.25 | Kompilace šablon a bootstrap přes platformBrowserDynamic. Sanitizaci nelze považovat za nepodstatnou jen kvůli statickému serveru; patch je použit i v sestaveném frontendovém kódu. |
| `@angular/core` | high | 21.2.12 → 21.2.25 | Browserový runtime. SSR/hydration cesty nepoužity; sanitizer/i18n advisory opraveny bez tvrzení, že byl nalezen funkční XSS exploit Kept. |
| `@angular/forms` | moderate | 21.2.12 → 21.2.25 | Přenesené common/core/platform-browser; aktualizace společně. |
| `@angular/platform-browser` | moderate | 21.2.12 → 21.2.25 | Přenesené animations/common/core; aktualizace společně. |
| `@angular/platform-browser-dynamic` | moderate | 21.2.12 → 21.2.25 | Přenesené frameworkové nálezy; bootstrap zachován, bez migrace API. |
| `@angular/router` | high | 21.2.12 → 21.2.25 | SSR numeric matrix parameter DoS opraven v 21.2.24. Kept používá browserový router; patch 21.2.25 zachovává Unicode navigaci a guardy. |
| `adm-zip` | high | 0.5.17 → 0.6.1 | Přihlášený uživatel může nahrát Takeout ZIP; getEntries/getData jsou dosažitelné. Kontrola velikosti až po getData nebránila alokaci. Nutná změna minor řady 0.x. Zachováno API i unzipper fallback; doplněny limity před alokací, během fallback dekomprese a duplicity. Symlink/SUID/extractAllTo advisory nemají přímou cestu: aplikace tyto extrakční metody nepoužívá. |
| `body-parser` | moderate | 1.20.6 → 1.20.8; SDK 2.3.0 beze změny | Přenesené qs. Express 4 zachován; patch body-parser přijímá opravený qs. JSON a urlencoded OAuth/unlock zpracování ověřují regresní sady. |
| `concurrently` | critical | 9.2.1 → 9.2.5 | Přenesené shell-quote. Vývojový start s pevnými příkazy, bez cesty z HTTP vstupu. Přesun do dev i aktualizace jeho pevně zadané shell-quote verze. |
| `fast-uri` | high | 3.1.6 → 3.1.8 | `MCP SDK → ajv → fast-uri`. URI normalizace JSON Schema, nikoli aplikační síťový fetch. Autority/porty/host advisory opraveny; přímý SSRF exploit aplikace neprokázán. |
| `hono` | moderate | 4.13.4 → 4.13.13 | Transitivní SDK. Aplikace montuje Express/StreamableHTTP, nepoužívá Hono SSG, JSX ani parseBody. Patch bez změny veřejného SDK. |
| `ip-address` | moderate | 10.5.0 → 10.7.4 | SDK express-rate-limit; také socks v build stromu. Kept SSRF kontroly v mcp/kept-client používají node net a vlastní kontroly, nikoli tyto chybné metody. Přímý bypass neprokázán; patch použit pro celý strom. |
| `multer` | high | 2.1.1 → 2.4.0 | HTTP multipart uploady včetně setup restore. Zpracování field names a přerušených uploadů je dosažitelné; opravená řada 2.x zachovává diskStorage, fileFilter a single. Ověřeny uploady a chybové zpracování. |
| `proxy-addr` | critical | 2.0.7 → 2.0.8 | Express 4 i SDK Express 5. Konkrétní advisory vyžaduje chybný IPv4-mapped IPv6 trust subnet. Kept má `trust proxy = 1`, tento subnet tedy nenastavuje. Patch přesto použit. Obecná důvěra v jeden proxy hop vyžaduje, aby externí provoz vedl přes očekávaný reverse proxy; zde se politika proxy nemění. |
| `qs` | moderate | 6.14.2 / 6.15.1 / 6.15.3 → 6.16.1 | Express query parser a body-parser. Nelze všechny parserové cesty označit za nedosažitelné; aktualizovány rodičovské rozsahy Express/body-parser místo override. Aplikace přímo nepoužívá zranitelné stringify comma API. |
| `shell-quote` | critical | 1.8.3 → 1.12.0 | concurrently a build launch-editor. Žádný serverový shell z uživatelského vstupu nebyl nalezen. Opraveno i po přesunu do dev. |
| `source-map-js` | high | 1.2.1 → 1.2.2 | `sanitize-html → postcss` a build nástroje. MCP sanitizuje HTML, ale nepřijímá zdrojové mapy pro SourceMapConsumer. Exploit indexed source map nebyl prokázán; kompatibilní patch odstranil nález. |
| `tar` | critical | 7.5.15 → 7.5.22 | Instalace sqlite3/node-gyp; server tar neimportuje a nemá TAR import endpoint. Opraveny parse, PAX, rekurze i dekompresní advisory. SQLite 6.0.1 a jeho nativní API zachovány. |
| `undici` | high | node-gyp 6.25.0 → 6.29.1; build 7.24.4 → 7.29.1 | Instalační stahování node-gyp a build nástroj. Npm balíček není aplikací importován; zranitelný npm WebSocket klient není serverový ws. Aktualizovány odděleně obě kompatibilní major řady. |
| `ws` | high | runtime 8.20.0 → 8.22.0; testové kopie 8.18.3 → 8.21.3, analyzer 7.5.10 → 7.5.13 | Server `/api/realtime` zpracovává upgrade před ověřením session; fragmentační DoS proto nelze vyloučit pouhým requireAuth. Opravena runtime řada 8 i kopie pod Socket.IO. Řada 7 není dotčena původními dvěma advisory pro ws 8. Testuje se připojení, odmítnutí bez tokenu, fragmentace a ping/pong. |

## Kompatibilita a přesné změny

[dependency-changes.md](dependency-changes.md) obsahuje všechny změněné přímé rozsahy, přesuny skupin a všechny změny verzí/umístění v lockfile. [dependency-changes.json](dependency-changes.json) uchovává úplné původní a nové záznamy všech 273 změněných cest, včetně integrity, dependency a peer hran a příznaků. Lockfile zůstal ve verzi 3; nebyl smazán a přegenerován od nuly.

Angular framework i compiler-cli jsou 21.2.25; CLI/build-devkit 21.2.27. Zůstává TypeScript 5.9.3, RxJS 7.5.7 a Zone 0.15.1 v povolených peer rozsazích. Nejde o major upgrade Angularu. Express aplikace zůstává 4.x (4.22.3), SDK interní Express se kompatibilně posunul 5.2.1 → 5.3.0. MCP SDK zůstává 1.31.0, Zod 3.25.76, openid-client 6.8.8 a SQLite 6.0.1.

`adm-zip` 0.6.1 je nutná výjimka z patch-only aktualizací: všechny původní ZIP advisory jsou opraveny až v této řadě. Použité API konstruktor/getEntries/getData zůstává stejné; odmítnutí duplicitních cest a nadlimitních archivů je záměrná bezpečnostní změna. Kompatibilní ZIP fallback zůstává dostupný. Limit 250 MiB na položku a 10 GiB celkem zůstává zachován; fallback jej nyní kontroluje i během čtení. Celý upload a souběžné legitimní importy nadále spotřebovávají paměť/CPU; velikost uploadů, kapacitu kontejneru a přístup uživatelů je potřeba zvolit pro konkrétní testovací prostředí.

Aktualizace byly cílené příkazy `npm update <výslovný seznam balíčků> --package-lock-only`, následované čistým `npm ci`. Vedle původních nálezů byly kompatibilně opraveny `brace-expansion`, `baseline-browser-mapping`, `browserslist`, `immutable`, `js-yaml`, `tmp`, `socket.io-parser`, `engine.io`, `socket.io-adapter` a kořenový postcss-selector-parser 7. Nebyl použit `npm audit fix`, `--force`, override, ignorování advisory ani vypnutí auditu. Nedošlo ke změně autentizačních kontraktů, databázového schématu, Dockerfile ani Compose konfigurace.

## Zbývajících 15 nálezů pouze v devDependencies

Tyto balíčky nejsou instalovány finálním `npm ci --omit=dev`. Vývojové servery se nesmí používat jako produkční server. Pro build používejte důvěryhodné zdroje a konfiguraci; test/dev servery ponechte v izolované síti a nespouštějte build nad nedůvěryhodnými glob vzory či CSS. Jde o konkrétní mitigace, ne o ignorování auditu.

| Balíček | Závažnost | Důvod ponechání, dosažitelnost a mitigace |
| --- | --- | --- |
| `braces` 3.0.3 | high | [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): opravená verze neexistuje. Rekurzivní glob parser, pouze důvěryhodné build/watch vzory. Není v Node runtime ani browser bundlu aplikace. |
| `chokidar` 3.6.0 | high | Přenesené braces přes watchery Karma, nodemon a webpack-dev-server. Vyžaduje útočníkem řízený vzor; změna frameworku/test runneru je samostatná migrace. Pouze lokální důvěryhodné watch cesty. |
| `micromatch` 4.0.8 | high | Přenesené braces. Dependency build/dev proxy middleware; HTTP request sám není důkazem řízení glob konfigurace. Nepřijímat nedůvěryhodné glob vzory. |
| `http-proxy-middleware` 3.0.7 / 2.0.10 | high | Přenesené micromatch/braces. Konfigurace lokální Angular dev proxy, není to produkční reverse proxy aplikace. Nevystavovat ng serve do nedůvěryhodné sítě. |
| `webpack-dev-server` 5.2.6 | high | Přenesené chokidar, middleware a sockjs. Potřebný pro ng serve. Docker jej nespouští ani neinstaluje do finální fáze. Izolovat dev server. |
| `karma` 6.4.4 | high | Přenesené braces/chokidar. Nutný stávající Angular test runner, důvěryhodná testovací konfigurace. Automatický návrh npm na Karma 4 neřeší bezpečně kompatibilitu celé sady. |
| `karma-jasmine` 5.0.1 | high | Přenesená Karma. Zachován runner a existující testy; stejná izolace jako Karma. |
| `nodemon` 3.1.14 | high | Přenesený chokidar/braces ve vývojovém `npm run api`; produkční CMD je node. Důvěryhodné watch nastavení a lokální vývoj. |
| `@angular-devkit/build-webpack` 0.2102.27 | high | Přenesený webpack-dev-server. Změna na Angular 10 doporučovaná audit fix by rozbila build, nejde o kompatibilní opravu. Stejná izolace dev serveru. |
| `@angular/build` 21.2.27 | high | Přenesená Karma; nemá původní frameworkové XSS advisory. Toolchain zůstává kompatibilní, build zdroje musí být důvěryhodné. |
| `@angular-devkit/build-angular` 21.2.27 | high | Agreguje výše uvedené dev závislosti. Opravený Angular framework zůstává 21.2.25. Nemigrovat framework/test runner v rámci záplat runtime. |
| `uuid` 8.3.2 | moderate | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), oprava od 11.1.1. Pouze sockjs dev serveru používá v4 bez cílového bufferu; advisory míří na v3/v5/v6 s bufferem. Major override by porušil kontrakt sockjs. Nesouvisí s HTTP crypto.randomUUID fallbackem aplikace. |
| `sockjs` 0.3.24 | moderate | Přenesené uuid. Pouze live reload dev serveru, který v produkci neběží. Izolovat ng serve. |
| `postcss-selector-parser` 6.1.4 pod PurgeCSS | moderate | [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf), oprava 7.1.6; rozsah PurgeCSS 4 je ^6.0.6. Kořenová řada 7 opravena. PurgeCSS config je již ve výchozím commitu zakomentovaný a vrací prázdný výsledek; nezpracovává uživatelské CSS. Major migrace PurgeCSS nebyla vynucena. |
| `purgecss` 4.1.3 | moderate | Přenesený parser 6. Zachován původní build skript i stávající chování konfigurace. Pouze důvěryhodné build vstupy; případné budoucí zapnutí či migrace PurgeCSS vyžaduje vlastní CSS regresní ověření. |

## Validace

Prostředí: Windows, Node.js 24.19.0, npm 11.17.0. Všechny níže uvedené kontroly prošly. Lokální automatizované testy nenahrazují ruční akceptaci existujícího `kept-test` ani skutečný Alpine kontejner.

| Kontrola | Výsledek a rozsah důkazu |
| --- | --- |
| Čisté `npm ci` | Exit 0; 1096 nainstalovaných balíčků. Opakováno po poslední aktualizaci lockfile. Bez `--force`, `--legacy-peer-deps` nebo vypnutí skriptů/auditu. Npm hlásí stávající deprecated balíčky a informativní allow-scripts warnings; funkční načtení nativního sqlite3 bylo ověřeno běžícím serverem. |
| `npm ls --all --json` | Exit 0, žádné `problems`; ověřena konzistence celého instalovaného stromu a peer závislostí. |
| `npm run build` | Exit 0; produkční Angular bundle 1.72 MB, hash `75d54899c4630a42`. Sass hlásí existující @import deprecation warnings. PurgeCSS prošel, jeho stávající zakomentovaná konfigurace vrací `[]`. |
| `npm test -- --watch=false --browsers=ChromeHeadless` | 33/33. Chromium Headless 151.0.7922.34; `CHROME_BIN` směřoval na instalovaný Playwright headless shell. První pokus s Edge v sandboxu nenastartoval browser; Chromium běh prošel. Zahrnuje role/guardy, profil, Unicode router, sidebar, UUID, motivy a outbox. |
| `npm run test:personal` | 4/4. Kontrastní matice obou motivů; přesné branding assety ve zdroji i dist; UUID ve worker globálu; skutečný produkční frontend s izolovaným API/SQLite. |
| Český text, fonty, HTTP UUID a HTTPS | Browserový test vytvořil `Příliš žluťoučký kůň` v reálném nezabezpečeném HTTP kontextu (`isSecureContext=false`), ověřil API persistenci a reload, načtení běžného i kurzivního lokálního fontu a branding v obou motivech. HTTPS zachoval nativní Crypto, worker UUID i registraci PWA workeru. Žádná JS page error. |
| `npm run test:sync` | Exit 0, Sync smoke tests passed; dočasná SQLite/data. |
| `npm run test:native` | Exit 0, Native client hardening tests passed; migrace SQLite, přílohy, idempotence, uživatelská izolace a oprávnění podle existující sady. |
| `npm run test:reminders` | 10/10 včetně časových pásem, DST a měsíčního opakování. |
| `npm run test:mcp` | 23/23; API klient, sanitizace, omezení vlastnictví a zamčených poznámek, scope/revokace tokenů, stdio handshake, remote OAuth a explicitní OIDC link/login/disconnect s lokálním testovacím issuerem. Nejde o test produkčního externího IdP. |
| `node --test server/security-runtime.test.js` | 2/2: malý ZIP bomb fixture s vynuceným unzipper fallbackem, skutečný Takeout import české připnuté poznámky a deduplikace, deklarovaná nadlimitní velikost, duplicitní ZIP jména, multipart index, admin/user a cizí poznámky, WebSocket auth, fragmentace a ping/pong. |
| Izolované `npm ci --omit=dev` mimo checkout | Exit 0, 273 nainstalovaných balíčků. Bez původních node_modules a bez možnosti rodičovského rozlišení do repozitáře. `require.resolve` ověřil nepřítomnost concurrently, Angular core/CLI, TypeScriptu a Playwrightu; SQLite/adm-zip/ws/Express se načetly. |
| Testy nad touto produkční instalací | `node --test server/security-runtime.test.js mcp/*.test.mjs`: 25/25, včetně OAuth/OIDC a živého API. Instalace použila kopie server/mcp/dist a stejný lockfile, nikoli Docker. |
| Audit skutečně nainstalovaného runtime | `npm audit --omit=dev`: exit 0, 0 nálezů; [audit-runtime-installed.json](audit-runtime-installed.json). Také `npm ls --all --omit=dev` prošlo. |
| `git diff --check` | Prošlo. |
| Docker / autentizovaný existující kept-test | Neprovedeno: Docker není dostupný, do vzdáleného prostředí se nepřistupovalo. Postup akceptace je níže. |

Nová sada bezpečnostních regresí je samostatný příkaz; původní npm test skripty zůstávají zachovány. Při vývoji fixture byly opraveny jeho očekávání: Takeout deduplikace potřebuje stabilní původní timestamp a opravený Multer bezpečně přijímá nepoužívané pole s nadměrným indexem místo jeho povinného odmítnutí. Tyto pokusy nejsou započítány jako úspěšné běhy; finální výše uvedené běhy mají nulový počet selhání.

## Bezpečný postup pro existující izolované kept-test

1. Použijte pouze host existujícího izolovaného `kept-test`, nikdy VM 104. Ověřte Docker context, Compose project, porty, mounty a síť. Zaznamenejte aktuální image ID/digest a uložte zálohu **testovacích** dat. Větev stahujte do samostatného checkoutu; nepřepínejte produkční checkout ani integrační větev.
2. V samostatném checkoutu proveďte `git fetch contrib personal/security-hardening`, `git switch --detach contrib/personal/security-hardening` a porovnejte plný SHA s dodaným commitem. Sestavte vlastní lokální image: `docker build --pull --no-cache -t kept-security-test:<SHA> .`. Nepouštějte deploy-docker-images ani obecný docker:deploy.
3. V existující testovací Compose konfiguraci připravte override **jen pro službu kept-test** s novým lokálním image tagem. Před spuštěním zkontrolujte výstup `docker compose -p <existujici-test-projekt> -f <test-compose> -f <security-override> config`: žádné produkční mounty, `container_name`, síť, porty ani tajné klíče. Použijte testovací BASE_URL a odděleného OIDC klienta s testovací callback URL. Síťový přístup omezte na nutné testovací služby; nepřebírejte produkční OAuth/push/kalendářové údaje.
4. Spusťte pouze testovací službu: `docker compose -p <existujici-test-projekt> -f <test-compose> -f <security-override> up -d --no-deps <test-sluzba>`. Nespouštějte výchozí docker-compose.yml z tohoto repozitáře: pojmenovává kept-app a používá cizí image. Ověřte log, zdraví API a vlastnictví testovacích dat po entrypointu.
5. V kontejneru spusťte `npm audit --omit=dev` a `npm ls --omit=dev`; očekává se 0 nálezů. Ověřte `node -e "require('sqlite3'); require('adm-zip'); require('ws')"`. Pro bezpečnostní regresi lze v testovacím kontejneru spustit `node --test server/security-runtime.test.js`; test si vytvoří vlastní dočasná data a server na jiném portu. Pokud kontejner nemá povolený přístup do npm registru, audit proveďte v odděleném build/test prostředí nad stejným lockfile a omezení zaznamenejte.
6. Ručně ověřte přihlášení admina i běžného uživatele, omezení Users a přístupu k cizím poznámkám, český text a lokální fonty, branding v obou motivech, vytvoření poznámky přes skutečné HTTP z jiného zařízení, reload a synchronizaci mezi dvěma klienty, realtime, přílohy a Takeout import. Ověřte testovací OAuth/MCP scopes/revokaci a OIDC link/login/disconnect. Pro HTTPS zkontrolujte původní nativní UUID a PWA worker. Nepoužívejte útočné ZIPy nebo nekontrolované zátěžové testy na sdíleném hostu.
7. Při regresi vraťte předchozí testovací image/digest přes stejný testovací override. Pokud je nutné obnovit testovací data, zastavte pouze testovací službu a použijte její zálohu. Neměňte produkční službu, integrační větev ani původní PR. Testovací image není souhlas s produkčním nasazením.
