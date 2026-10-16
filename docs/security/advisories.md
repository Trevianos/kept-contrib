# Původní advisory a ověření opravených verzí

Zdroj: živý npm audit z 16. 10. 2026 (celý záznam v [audit-before.json](audit-before.json)). 22 je počet označených balíčků; nejde o počet unikátních advisory. Řetězcové via položky jsou přenesené nálezy z dalších balíčků. Každá zde uvedená verze po opravě byla strojově ověřena mimo dotčený semver rozsah. Počet ani pořadí advisory není stabilní v čase.

## @angular/animations

Přenesené nálezy: `@angular/core`.


## @angular/common

Přenesené nálezy: `@angular/core`.

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-48r7-hpm6-gfxm](https://github.com/advisories/GHSA-48r7-hpm6-gfxm) | @angular/common: Denial of Service (DoS) via OOM in Date Formatting (formatDate) | `>=21.0.0-next.0 <21.2.17` | 21.2.25 (build/dev) |
| [GHSA-39pv-4j6c-2g6v](https://github.com/advisories/GHSA-39pv-4j6c-2g6v) | @angular/common: Weak 32-Bit Cache Key Hashing in `HttpTransferCache` Leading to Cross-Request Data Leakage and State Poisoning | `>=21.0.0-next.0 <21.2.17` | 21.2.25 (build/dev) |
| [GHSA-p3vc-36g9-x9gr](https://github.com/advisories/GHSA-p3vc-36g9-x9gr) | @angular/common: Denial of Service (DoS) via OOM in Number Formatting (digitsInfo) | `>=21.0.0-next.0 <21.2.15` | 21.2.25 (build/dev) |
| [GHSA-q6f4-qqrg-jv6x](https://github.com/advisories/GHSA-q6f4-qqrg-jv6x) | @angular/common: Information Leak via Default Caching of Credentialed Requests in HttpTransferCache | `>=21.0.0-next.0 <21.2.15` | 21.2.25 (build/dev) |
| [GHSA-jhpw-976m-542j](https://github.com/advisories/GHSA-jhpw-976m-542j) | Angular: Cache-Key Ambiguity in HttpTransferCache Leading to Cross-Request Response Reuse and State Poisoning | `>=21.0.0-next.0 <21.2.19` | 21.2.25 (build/dev) |
| [GHSA-p297-fm68-3q8c](https://github.com/advisories/GHSA-p297-fm68-3q8c) | Angular: Information Leak via `HttpTransferCache` Bypass When Using `withRequestsMadeViaParent` | `>=21.0.0 <21.2.20` | 21.2.25 (build/dev) |

## @angular/compiler

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-58w9-8g37-x9v5](https://github.com/advisories/GHSA-58w9-8g37-x9v5) | @angular/compiler: Two-Way Property Binding Sanitization Bypass (XSS) | `>=21.0.0-next.0 <21.2.17` | 21.2.25 (build/dev) |
| [GHSA-f3m7-gqxr-g87x](https://github.com/advisories/GHSA-f3m7-gqxr-g87x) | Angular: Template and Attribute Namespace Sanitization Bypass (XSS) | `>=21.0.0-next.0 <21.2.15` | 21.2.25 (build/dev) |
| [GHSA-jj27-h5hq-8x99](https://github.com/advisories/GHSA-jj27-h5hq-8x99) | Angular i18n: Cross-Site Scripting (XSS) via event-handler attributes | `>=21.0.0-next.0 <21.2.19` | 21.2.25 (build/dev) |
| [GHSA-hh8m-fm6v-7cvg](https://github.com/advisories/GHSA-hh8m-fm6v-7cvg) | Angular: Sanitization bypass via directive host bindings on concrete host elements in @angular/core and @angular/compiler | `>=21.0.0 <21.2.20` | 21.2.25 (build/dev) |

## @angular/core

Přenesené nálezy: `@angular/compiler`.

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-f3m7-gqxr-g87x](https://github.com/advisories/GHSA-f3m7-gqxr-g87x) | Angular: Template and Attribute Namespace Sanitization Bypass (XSS) | `>=21.0.0-next.0 <21.2.15` | 21.2.25 (build/dev) |
| [GHSA-692r-grfm-v8x7](https://github.com/advisories/GHSA-692r-grfm-v8x7) | @angular/core: Angular Template and Dynamic Component Namespace Bypass leading to Cross-Site Scripting (XSS) | `>=21.0.0-next.0 <21.2.15` | 21.2.25 (build/dev) |
| [GHSA-rgjc-h3x7-9mwg](https://github.com/advisories/GHSA-rgjc-h3x7-9mwg) | Angular Client Hydration DOM Clobbering & Response-Cache Poisoning | `>=21.0.0-next.0 <21.2.17` | 21.2.25 (build/dev) |
| [GHSA-jj27-h5hq-8x99](https://github.com/advisories/GHSA-jj27-h5hq-8x99) | Angular i18n: Cross-Site Scripting (XSS) via event-handler attributes | `>=21.0.0-next.0 <21.2.19` | 21.2.25 (build/dev) |
| [GHSA-hh8m-fm6v-7cvg](https://github.com/advisories/GHSA-hh8m-fm6v-7cvg) | Angular: Sanitization bypass via directive host bindings on concrete host elements in @angular/core and @angular/compiler | `>=21.0.0 <21.2.20` | 21.2.25 (build/dev) |

## @angular/forms

Přenesené nálezy: `@angular/common`, `@angular/core`, `@angular/platform-browser`.


## @angular/platform-browser

Přenesené nálezy: `@angular/animations`, `@angular/common`, `@angular/core`.


## @angular/platform-browser-dynamic

Přenesené nálezy: `@angular/common`, `@angular/compiler`, `@angular/core`, `@angular/platform-browser`.


## @angular/router

Přenesené nálezy: `@angular/common`, `@angular/core`, `@angular/platform-browser`.

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-ff3f-86qr-9cv3](https://github.com/advisories/GHSA-ff3f-86qr-9cv3) | Angular Server-Side Rendering (SSR): Denial of Service via Numeric URL Matrix Parameters | `>=21.0.0 <21.2.24` | 21.2.25 (build/dev) |

## adm-zip

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-xcpc-8h2w-3j85](https://github.com/advisories/GHSA-xcpc-8h2w-3j85) | adm-zip: Crafted ZIP file triggers 4GB memory allocation | `<0.6.0` | 0.6.1 (runtime) |
| [GHSA-vwc7-r8mq-g2x9](https://github.com/advisories/GHSA-vwc7-r8mq-g2x9) | adm-zip extraction follows destination symlinks, allowing arbitrary file overwrite | `>=0.5.9 <=0.6.0` | 0.6.1 (runtime) |
| [GHSA-7q85-xj36-vmfc](https://github.com/advisories/GHSA-7q85-xj36-vmfc) | adm-zip: Uncontrolled memory allocation via the declared uncompressed size (DoS) | `<0.6.1` | 0.6.1 (runtime) |
| [GHSA-rcw4-f5rp-g42v](https://github.com/advisories/GHSA-rcw4-f5rp-g42v) | adm-zip: Decompression-bomb protection (fix for CVE-2026-39244) can be bypassed by declaring uncompressed size as 0 | `<=0.6.0` | 0.6.1 (runtime) |
| [GHSA-j5f4-cc29-5x44](https://github.com/advisories/GHSA-j5f4-cc29-5x44) | adm-zip extraction preserves SUID/SGID bits from untrusted ZIPs -> local privilege escalation | `<=0.6.0` | 0.6.1 (runtime) |
| [GHSA-p634-w6r4-rjp2](https://github.com/advisories/GHSA-p634-w6r4-rjp2) | adm-zip: Duplicate ZIP entry names: getEntry() and extractAllTo() resolve to different content | `<=0.6.0` | 0.6.1 (runtime) |
| [GHSA-c6fg-446q-cg94](https://github.com/advisories/GHSA-c6fg-446q-cg94) | adm-zip: getDataAsync() bypasses the maxOutputLength size guard enforced by the synchronous getData() path | `<=0.6.0` | 0.6.1 (runtime) |
| [GHSA-8238-w5pm-2374](https://github.com/advisories/GHSA-8238-w5pm-2374) | adm-zip: Unhandled error event in async DEFLATE decompression crashes Node.js process (DoS) | `<=0.6.0` | 0.6.1 (runtime) |

## body-parser

Přenesené nálezy: `qs`.


## concurrently

Přenesené nálezy: `shell-quote`.


## fast-uri

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-qw65-cvwx-89v3](https://github.com/advisories/GHSA-qw65-cvwx-89v3) | fast-uri vulnerable to authority injection via an unvalidated port in serialize | `>=3.0.0 <3.1.7` | 3.1.8 (runtime) |
| [GHSA-58mr-gqgx-xq4g](https://github.com/advisories/GHSA-58mr-gqgx-xq4g) | fast-uri vulnerable to host confusion via an unclosed bracket in the URI authority | `=3.1.6` | 3.1.8 (runtime) |
| [GHSA-hrr3-gc8f-f4qj](https://github.com/advisories/GHSA-hrr3-gc8f-f4qj) | fast-uri vulnerable to inconsistent host case normalization via percent-encoded octets | `>=3.0.0 <3.1.8` | 3.1.8 (runtime) |

## hono

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-gqvv-2mrq-wpjv](https://github.com/advisories/GHSA-gqvv-2mrq-wpjv) | Hono: Incomplete fix for CVE-2026-39408: `toSSG()` still writes files outside the output directory | `<4.13.5` | 4.13.13 (runtime) |
| [GHSA-g6gw-c38x-mqfc](https://github.com/advisories/GHSA-g6gw-c38x-mqfc) | Hono: Unbounded dot-notation nesting in `parseBody()` can cause memory exhaustion | `<4.13.5` | 4.13.13 (runtime) |
| [GHSA-crvj-82cr-hjcx](https://github.com/advisories/GHSA-crvj-82cr-hjcx) | Hono: Query parser reads parameters after the URL fragment, causing cache-key and proxy interpretation differentials | `<4.13.5` | 4.13.13 (runtime) |
| [GHSA-hxh3-vqpv-xpqv](https://github.com/advisories/GHSA-hxh3-vqpv-xpqv) | hono/jsx renders plain strings unescaped in boundary components, leading to XSS | `<4.13.7` | 4.13.13 (runtime) |

## ip-address

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-rpw4-54j3-4h4q](https://github.com/advisories/GHSA-rpw4-54j3-4h4q) | ip-address: Address6.isLinkLocal() recognizes fe80::/64 rather than fe80::/10, allowing SSRF and trust-boundary bypass to on-link hosts | `<=10.5.0` | 10.7.4 (runtime) |
| [GHSA-2vr4-cq9g-pvrc](https://github.com/advisories/GHSA-2vr4-cq9g-pvrc) | ip-address: no classifier recognizes the NAT64 local-use range 64:ff9b:1::/48, allowing SSRF and trust-boundary bypass | `>=10.2.0 <=10.5.0` | 10.7.4 (runtime) |
| [GHSA-j6r3-76f7-8jcv](https://github.com/advisories/GHSA-j6r3-76f7-8jcv) | ip-address: isInSubnet() and isHostInSubnet() compare addresses of different families as if they shared an address space, allowing an allowlist check to admit an address outside its range | `<=10.7.0` | 10.7.4 (runtime) |
| [GHSA-h3mg-xc3c-68pw](https://github.com/advisories/GHSA-h3mg-xc3c-68pw) | ip-address: Address6 builds a parse diagnostic proportional to the input with no length bound, allowing a single long string to stall or crash the process | `<=10.7.0` | 10.7.4 (runtime) |

## multer

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-72gw-mp4g-v24j](https://github.com/advisories/GHSA-72gw-mp4g-v24j) | Multer vulnerable to Denial of Service via deeply nested field names | `>=1.0.0 <2.2.0` | 2.4.0 (runtime) |
| [GHSA-3p4h-7m6x-2hcm](https://github.com/advisories/GHSA-3p4h-7m6x-2hcm) | Multer vulnerable to Denial of Service via incomplete cleanup of aborted uploads | `>=2.0.0-alpha.1 <2.2.0` | 2.4.0 (runtime) |
| [GHSA-wc9g-mqfw-jrwm](https://github.com/advisories/GHSA-wc9g-mqfw-jrwm) | multer vulnerable to Denial of Service via crafted multipart field names | `<2.3.0` | 2.4.0 (runtime) |
| [GHSA-qvfw-j98x-7q72](https://github.com/advisories/GHSA-qvfw-j98x-7q72) | multer vulnerable to file size limit bypass via async fileFilter race condition | `<2.3.0` | 2.4.0 (runtime) |
| [GHSA-535w-7cp7-47q4](https://github.com/advisories/GHSA-535w-7cp7-47q4) | multer vulnerable to Denial of Service via oversized array index in field names | `<2.3.0` | 2.4.0 (runtime) |

## proxy-addr

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) | proxy-addr vulnerable to IP spoofing via IPv4-mapped IPv6 trust subnet | `>=1.1.0 <2.0.8` | 2.0.8 (runtime) |

## qs

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-q8mj-m7cp-5q26](https://github.com/advisories/GHSA-q8mj-m7cp-5q26) | qs has a remotely triggerable DoS: qs.stringify crashes with TypeError on null/undefined entries in comma-format arrays when encodeValuesOnly is set | `>=6.11.1 <=6.15.1` | 6.16.1 (runtime) |
| [GHSA-x5fp-wj9c-mxmx](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx) | qs array-limit bypass via bracket-key comma parsing | `>=6.14.2 <=6.15.3` | 6.16.1 (runtime) |
| [GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) | qs: Denial of Service via Attacker Controlled isBuffer | `>=2.2.5 <6.16.0` | 6.16.1 (runtime) |

## shell-quote

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-w7jw-789q-3m8p](https://github.com/advisories/GHSA-w7jw-789q-3m8p) | shell-quote quote() does not escape newlines in object .op values | `>=1.1.0 <=1.8.3` | 1.12.0 (build/dev) |
| [GHSA-395f-4hp3-45gv](https://github.com/advisories/GHSA-395f-4hp3-45gv) | shell-quote: Quadratic-complexity Denial of Service in `parse()` (CWE-407) | `<=1.8.4` | 1.12.0 (build/dev) |

## source-map-js

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-68fv-2mgg-jv7q](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) | source-map-js allows event-loop denial of service through indexed source-map section offsets | `>=1.0.0 <1.2.2` | 1.2.2 (runtime) |

## tar

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh) | node-tar applies PAX size override to intermediary GNU long-name/long-link headers, causing tar parser interpretation differential (file smuggling) | `<=7.5.15` | 7.5.22 (runtime) |
| [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp) | node-tar: Process crash via PAX numeric path type confusion | `<=7.5.17` | 7.5.22 (runtime) |
| [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw) | node-tar: Decompression/parse DoS via unlimited input | `<=7.5.18` | 7.5.22 (runtime) |
| [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w) | node-tar: Negative tar entry size causes infinite loop in archive replace | `<=7.5.17` | 7.5.22 (runtime) |
| [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j) | node-tar: Uncaught Exception DoS via NUL byte in PAX path/linkpath records | `<=7.5.16` | 7.5.22 (runtime) |
| [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) | node-tar: Uncontrolled recursion in mapHas/filesFilter allows uncatchable stack-overflow DoS via crafted long-path tar with member selection | `<=7.5.20` | 7.5.22 (runtime) |

## undici

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-p88m-4jfj-68fv](https://github.com/advisories/GHSA-p88m-4jfj-68fv) | undici vulnerable to HTTP header injection via Set-Cookie percent-decoding | `<6.27.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-vxpw-j846-p89q](https://github.com/advisories/GHSA-vxpw-j846-p89q) | undici WebSocket client vulnerable to denial of service via fragment count bypass | `<6.27.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-g8m3-5g58-fq7m](https://github.com/advisories/GHSA-g8m3-5g58-fq7m) | undici vulnerable to Set-Cookie SameSite attribute downgrade via permissive substring matching | `<6.27.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-8xcm-r25x-g524](https://github.com/advisories/GHSA-8xcm-r25x-g524) | undici vulnerable to downstream response desynchronization via retry interceptor | `<6.28.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-m8rv-5g2x-5cg5](https://github.com/advisories/GHSA-m8rv-5g2x-5cg5) | undici vulnerable to CRLF Injection via blob-like body 'type' property | `<6.28.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-v3r7-h72x-cjcm](https://github.com/advisories/GHSA-v3r7-h72x-cjcm) | undici vulnerable to cookie attribute injection via unsanitized domain and unparsed setCookie fields | `<6.28.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-35p6-xmwp-9g52](https://github.com/advisories/GHSA-35p6-xmwp-9g52) | undici vulnerable to HTTP response queue poisoning via keep-alive socket reuse | `<6.27.0` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) | undici vulnerable to Denial of Service via unhandled error in WebSocket permessage-deflate decompression | `>=6.25.0 <6.28.1` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) | undici vulnerable to downstream response splitting via retry interceptor | `<6.28.1` | 6.29.1 (runtime), 7.29.1 (build/dev) |
| [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) | undici vulnerable to Denial of Service via unrequested WebSocket subprotocol | `>=6.7.0 <6.28.1` | 6.29.1 (runtime), 7.29.1 (build/dev) |

## ws

| Advisory | Problém | Dotčené verze | Opravené verze v lockfile |
| --- | --- | --- | --- |
| [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) | ws: Uninitialized memory disclosure | `>=8.0.0 <8.20.1` | 8.21.3 (build/dev), 8.21.3 (build/dev), 7.5.13 (build/dev), 8.22.0 (runtime) |
| [GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p) | ws: Memory exhaustion DoS from tiny fragments and data chunks | `>=8.0.0 <8.21.0` | 8.21.3 (build/dev), 8.21.3 (build/dev), 7.5.13 (build/dev), 8.22.0 (runtime) |
