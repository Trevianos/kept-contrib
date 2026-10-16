# Přesné změny manifestu a lockfile

Úplný strojový rozdíl každého změněného záznamu včetně dependency hran, integrity a dev/optional příznaků: [dependency-changes.json](dependency-changes.json). Odstraněné vnořené záznamy mohou být deduplikovány do kořene; neznamenají odstranění funkce.

| Přímý balíček | Před: skupina a rozsah | Po: skupina a rozsah | Zamčeno před → po |
| --- | --- | --- | --- |
| `@angular-devkit/build-angular` | devDependencies: `^21.2.10` | devDependencies: `^21.2.27` | 21.2.10 → 21.2.27 |
| `@angular/animations` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/cli` | devDependencies: `~21.2.10` | devDependencies: `~21.2.27` | 21.2.10 → 21.2.27 |
| `@angular/common` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/compiler` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/compiler-cli` | devDependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/core` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/forms` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/platform-browser` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/platform-browser-dynamic` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@angular/router` | dependencies: `^21.2.12` | devDependencies: `^21.2.25` | 21.2.12 → 21.2.25 |
| `@capacitor/core` | dependencies: `^8.3.4` | devDependencies: `^8.3.4` | 8.3.4 → 8.3.4 |
| `@popperjs/core` | dependencies: `^2.11.5` | devDependencies: `^2.11.5` | 2.11.8 → 2.11.8 |
| `@types/jszip` | dependencies: `^3.4.0` | devDependencies: `^3.4.0` | 3.4.0 → 3.4.0 |
| `adm-zip` | dependencies: `^0.5.16` | dependencies: `^0.6.1` | 0.5.17 → 0.6.1 |
| `bricks.js` | dependencies: `^1.8.0` | devDependencies: `^1.8.0` | 1.8.0 → 1.8.0 |
| `concurrently` | dependencies: `^9.2.1` | devDependencies: `^9.2.5` | 9.2.1 → 9.2.5 |
| `express` | dependencies: `^4.22.1` | dependencies: `^4.22.3` | 4.22.1 → 4.22.3 |
| `jszip` | dependencies: `^3.10.1` | devDependencies: `^3.10.1` | 3.10.1 → 3.10.1 |
| `multer` | dependencies: `^2.1.1` | dependencies: `^2.3.0` | 2.1.1 → 2.4.0 |
| `node-snackbar` | dependencies: `^0.1.16` | devDependencies: `^0.1.16` | 0.1.16 → 0.1.16 |
| `rxjs` | dependencies: `~7.5.0` | devDependencies: `~7.5.0` | 7.5.7 → 7.5.7 |
| `timepicker-ui` | dependencies: `^4.3.0` | devDependencies: `^4.3.0` | 4.3.0 → 4.3.0 |
| `tslib` | dependencies: `^2.3.0` | devDependencies: `^2.3.0` | 2.8.1 → 2.8.1 |
| `ws` | dependencies: `^8.20.0` | dependencies: `^8.21.0` | 8.20.0 → 8.22.0 |
| `zone.js` | dependencies: `~0.15.1` | devDependencies: `~0.15.1` | 0.15.1 → 0.15.1 |

## Změny verzí všech uzlů

| Cesta v node_modules | Před | Po |
| --- | --- | --- |
| `node_modules/@angular-devkit/architect` | 0.2102.10 | 0.2102.27 |
| `node_modules/@angular-devkit/build-angular` | 21.2.10 | 21.2.27 |
| `node_modules/@angular-devkit/build-webpack` | 0.2102.10 | 0.2102.27 |
| `node_modules/@angular-devkit/core` | 21.2.10 | 21.2.27 |
| `node_modules/@angular-devkit/schematics` | 21.2.10 | 21.2.27 |
| `node_modules/@angular/animations` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/build` | 21.2.10 | 21.2.27 |
| `node_modules/@angular/cli` | 21.2.10 | 21.2.27 |
| `node_modules/@angular/cli/node_modules/@modelcontextprotocol/sdk` | 1.26.0 | — |
| `node_modules/@angular/cli/node_modules/accepts` | 2.0.0 | — |
| `node_modules/@angular/cli/node_modules/body-parser` | 2.3.0 | — |
| `node_modules/@angular/cli/node_modules/body-parser/node_modules/content-type` | 2.1.0 | — |
| `node_modules/@angular/cli/node_modules/content-disposition` | 1.1.0 | — |
| `node_modules/@angular/cli/node_modules/cookie-signature` | 1.2.2 | — |
| `node_modules/@angular/cli/node_modules/express` | 5.2.1 | — |
| `node_modules/@angular/cli/node_modules/finalhandler` | 2.1.1 | — |
| `node_modules/@angular/cli/node_modules/fresh` | 2.0.0 | — |
| `node_modules/@angular/cli/node_modules/media-typer` | 1.1.1 | — |
| `node_modules/@angular/cli/node_modules/merge-descriptors` | 2.0.0 | — |
| `node_modules/@angular/cli/node_modules/mime-db` | 1.54.0 | — |
| `node_modules/@angular/cli/node_modules/mime-types` | 3.0.2 | — |
| `node_modules/@angular/cli/node_modules/negotiator` | 1.1.0 | — |
| `node_modules/@angular/cli/node_modules/negotiator/node_modules/content-type` | 2.1.0 | — |
| `node_modules/@angular/cli/node_modules/qs` | 6.15.3 | — |
| `node_modules/@angular/cli/node_modules/send` | 1.2.1 | — |
| `node_modules/@angular/cli/node_modules/serve-static` | 2.2.1 | — |
| `node_modules/@angular/cli/node_modules/type-is` | 2.1.0 | — |
| `node_modules/@angular/cli/node_modules/type-is/node_modules/content-type` | 2.1.0 | — |
| `node_modules/@angular/cli/node_modules/zod` | 4.3.6 | 4.6.6 |
| `node_modules/@angular/common` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/compiler` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/compiler-cli` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/core` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/forms` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/platform-browser` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/platform-browser-dynamic` | 21.2.12 | 21.2.25 |
| `node_modules/@angular/router` | 21.2.12 | 21.2.25 |
| `node_modules/@babel/code-frame` | 7.29.0 | 7.29.7 |
| `node_modules/@babel/compat-data` | 7.29.3 | 7.29.7 |
| `node_modules/@babel/core` | 7.29.0 | 7.29.7 |
| `node_modules/@babel/core/node_modules/@babel/generator` | — | 7.29.8 |
| `node_modules/@babel/helper-compilation-targets` | 7.28.6 | 7.29.7 |
| `node_modules/@babel/helper-globals` | 7.28.0 | 7.29.7 |
| `node_modules/@babel/helper-module-imports` | 7.28.6 | 7.29.7 |
| `node_modules/@babel/helper-module-transforms` | 7.28.6 | 7.29.7 |
| `node_modules/@babel/helper-string-parser` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/helper-validator-identifier` | 7.28.5 | 7.29.7 |
| `node_modules/@babel/helper-validator-option` | 7.27.1 | 7.29.7 |
| `node_modules/@babel/helpers` | 7.29.2 | 7.29.10 |
| `node_modules/@babel/parser` | 7.29.3 | 7.29.9 |
| `node_modules/@babel/template` | 7.28.6 | 7.29.7 |
| `node_modules/@babel/traverse` | 7.29.0 | 7.29.10 |
| `node_modules/@babel/traverse/node_modules/@babel/generator` | — | 7.29.8 |
| `node_modules/@babel/types` | 7.29.0 | 7.29.8 |
| `node_modules/@emnapi/core` | 1.10.0 | 1.11.3 |
| `node_modules/@emnapi/runtime` | 1.10.0 | 1.11.3 |
| `node_modules/@emnapi/wasi-threads` | 1.2.1 | 1.2.3 |
| `node_modules/@esbuild/aix-ppc64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/android-arm` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/android-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/android-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/darwin-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/darwin-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/freebsd-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/freebsd-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-arm` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-ia32` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-loong64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-mips64el` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-ppc64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-riscv64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-s390x` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/linux-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/netbsd-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/netbsd-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/openbsd-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/openbsd-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/openharmony-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/sunos-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/win32-arm64` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/win32-ia32` | 0.27.3 | 0.28.1 |
| `node_modules/@esbuild/win32-x64` | 0.27.3 | 0.28.1 |
| `node_modules/@jsonjoy.com/fs-core` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-fsa` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-node` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-node-builtins` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-node-to-fsa` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-node-utils` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-print` | 4.57.2 | 4.80.0 |
| `node_modules/@jsonjoy.com/fs-snapshot` | 4.57.2 | 4.80.0 |
| `node_modules/@modelcontextprotocol/sdk/node_modules/content-disposition` | 1.1.0 | 2.0.1 |
| `node_modules/@modelcontextprotocol/sdk/node_modules/express` | 5.2.1 | 5.3.0 |
| `node_modules/@modelcontextprotocol/sdk/node_modules/express/node_modules/content-type` | — | 2.1.0 |
| `node_modules/@modelcontextprotocol/sdk/node_modules/qs` | 6.15.3 | — |
| `node_modules/@msgpackr-extract/msgpackr-extract-darwin-arm64` | 3.0.3 | 3.0.4 |
| `node_modules/@msgpackr-extract/msgpackr-extract-darwin-x64` | 3.0.3 | 3.0.4 |
| `node_modules/@msgpackr-extract/msgpackr-extract-linux-arm` | 3.0.3 | 3.0.4 |
| `node_modules/@msgpackr-extract/msgpackr-extract-linux-arm64` | 3.0.3 | 3.0.4 |
| `node_modules/@msgpackr-extract/msgpackr-extract-linux-x64` | 3.0.3 | 3.0.4 |
| `node_modules/@msgpackr-extract/msgpackr-extract-win32-x64` | 3.0.3 | 3.0.4 |
| `node_modules/@napi-rs/lzma-linux-x64-gnu` | — | 1.5.1 |
| `node_modules/@napi-rs/wasm-runtime` | 1.1.4 | 1.2.5 |
| `node_modules/@ngtools/webpack` | 21.2.10 | 21.2.27 |
| `node_modules/@npmcli/agent` | 4.0.0 | 4.0.2 |
| `node_modules/@npmcli/agent/node_modules/lru-cache` | 11.3.6 | 11.5.3 |
| `node_modules/@npmcli/git/node_modules/lru-cache` | 11.3.6 | 11.5.3 |
| `node_modules/@npmcli/package-json/node_modules/brace-expansion` | 5.0.6 | 5.0.12 |
| `node_modules/@npmcli/package-json/node_modules/minimatch` | 10.2.5 | 10.2.6 |
| `node_modules/@rollup/rollup-android-arm-eabi` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-android-arm64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-darwin-arm64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-darwin-x64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-freebsd-arm64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-freebsd-x64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-arm-gnueabihf` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-arm-musleabihf` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-arm64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-arm64-musl` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-loong64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-loong64-musl` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-ppc64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-ppc64-musl` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-riscv64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-riscv64-musl` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-s390x-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-x64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-linux-x64-musl` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-openbsd-x64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-openharmony-arm64` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-win32-arm64-msvc` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-win32-ia32-msvc` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-win32-x64-gnu` | 4.60.3 | 4.64.7 |
| `node_modules/@rollup/rollup-win32-x64-msvc` | 4.60.3 | 4.64.7 |
| `node_modules/@schematics/angular` | 21.2.10 | 21.2.27 |
| `node_modules/@sigstore/core` | 3.2.0 | 3.2.1 |
| `node_modules/@sigstore/protobuf-specs` | 0.5.1 | 0.5.2 |
| `node_modules/@sigstore/verify` | 3.1.0 | 3.1.1 |
| `node_modules/@tufjs/models/node_modules/brace-expansion` | 5.0.6 | 5.0.12 |
| `node_modules/@tufjs/models/node_modules/minimatch` | 10.2.5 | 10.2.6 |
| `node_modules/@tybys/wasm-util` | 0.10.2 | 0.10.4 |
| `node_modules/@types/estree` | 1.0.8 | 1.0.9 |
| `node_modules/@types/express-serve-static-core` | 4.19.8 | 4.19.9 |
| `node_modules/adm-zip` | 0.5.17 | 0.6.1 |
| `node_modules/baseline-browser-mapping` | 2.10.29 | 2.11.29 |
| `node_modules/body-parser` | 1.20.6 | 1.20.8 |
| `node_modules/body-parser/node_modules/qs` | 6.15.1 | — |
| `node_modules/bonjour-service` | 1.3.0 | 1.4.4 |
| `node_modules/brace-expansion` | 1.1.14 | 1.1.21 |
| `node_modules/browserslist` | 4.28.2 | 4.29.3 |
| `node_modules/cacache/node_modules/brace-expansion` | 5.0.6 | 5.0.12 |
| `node_modules/cacache/node_modules/lru-cache` | 11.3.6 | 11.5.3 |
| `node_modules/cacache/node_modules/minimatch` | 10.2.5 | 10.2.6 |
| `node_modules/caniuse-lite` | 1.0.30001792 | 1.0.30001816 |
| `node_modules/compression` | 1.8.1 | 1.8.2 |
| `node_modules/concat-stream` | 2.0.0 | — |
| `node_modules/concat-stream/node_modules/readable-stream` | 3.6.2 | — |
| `node_modules/concurrently` | 9.2.1 | 9.2.5 |
| `node_modules/copy-anything` | 2.0.6 | 3.0.5 |
| `node_modules/electron-to-chromium` | 1.5.353 | 1.5.458 |
| `node_modules/engine.io` | 6.6.7 | 6.6.11 |
| `node_modules/engine.io/node_modules/ws` | 8.18.3 | 8.21.3 |
| `node_modules/err-code` | 2.0.3 | — |
| `node_modules/esbuild` | 0.27.3 | 0.28.1 |
| `node_modules/esbuild-wasm` | 0.27.3 | 0.28.1 |
| `node_modules/express` | 4.22.1 | 4.22.3 |
| `node_modules/fast-uri` | 3.1.6 | 3.1.8 |
| `node_modules/glob-to-regex.js` | 1.2.0 | 1.3.1 |
| `node_modules/hono` | 4.13.4 | 4.13.13 |
| `node_modules/hosted-git-info/node_modules/lru-cache` | 11.3.6 | 11.5.3 |
| `node_modules/http-cache-semantics` | 4.2.0 | 4.3.0 |
| `node_modules/http-proxy-middleware` | 3.0.5 | 3.0.7 |
| `node_modules/ignore-walk/node_modules/brace-expansion` | 5.0.6 | 5.0.12 |
| `node_modules/ignore-walk/node_modules/minimatch` | 10.2.5 | 10.2.6 |
| `node_modules/image-size` | 0.5.5 | — |
| `node_modules/immutable` | 5.1.5 | 5.1.9 |
| `node_modules/ip-address` | 10.5.0 | 10.7.4 |
| `node_modules/is-what` | 3.14.1 | 4.1.16 |
| `node_modules/js-yaml` | 4.1.1 | 4.3.2 |
| `node_modules/launch-editor` | 2.13.2 | 2.14.2 |
| `node_modules/less` | 4.4.2 | 4.9.0 |
| `node_modules/less/node_modules/make-dir` | 2.1.0 | 5.1.0 |
| `node_modules/less/node_modules/semver` | 5.7.2 | — |
| `node_modules/lodash.merge` | — | 4.6.2 |
| `node_modules/make-fetch-happen` | 15.0.5 | 15.0.6 |
| `node_modules/make-fetch-happen/node_modules/content-type` | — | 2.1.0 |
| `node_modules/make-fetch-happen/node_modules/negotiator` | 1.0.0 | 1.1.0 |
| `node_modules/memfs` | 4.57.2 | 4.80.0 |
| `node_modules/msgpackr` | 1.11.12 | 1.12.1 |
| `node_modules/msgpackr-extract` | 3.0.3 | 3.0.4 |
| `node_modules/multer` | 2.1.1 | 2.4.0 |
| `node_modules/node-gyp/node_modules/undici` | 6.25.0 | 6.29.1 |
| `node_modules/node-releases` | 2.0.38 | 2.0.59 |
| `node_modules/nodemon/node_modules/brace-expansion` | 5.0.6 | 5.0.12 |
| `node_modules/ordered-binary` | 1.6.1 | 1.6.2 |
| `node_modules/p-map` | 7.0.4 | 7.1.1 |
| `node_modules/p-retry/node_modules/retry` | 0.13.1 | — |
| `node_modules/pacote` | 21.3.1 | 21.5.1 |
| `node_modules/path-scurry/node_modules/lru-cache` | 11.3.6 | 11.5.3 |
| `node_modules/pify` | 4.0.1 | — |
| `node_modules/piscina` | 5.1.4 | 5.3.2 |
| `node_modules/postcss` | 8.5.12 | 8.5.23 |
| `node_modules/postcss-safe-parser` | 7.0.1 | 7.1.0 |
| `node_modules/postcss-selector-parser` | 7.1.1 | 7.1.6 |
| `node_modules/probe-image-size` | — | 7.4.0 |
| `node_modules/probe-image-size/node_modules/debug` | — | 3.2.7 |
| `node_modules/probe-image-size/node_modules/iconv-lite` | — | 0.4.24 |
| `node_modules/probe-image-size/node_modules/needle` | — | 2.9.1 |
| `node_modules/promise-retry` | 2.0.1 | — |
| `node_modules/proxy-addr` | 2.0.7 | 2.0.8 |
| `node_modules/purgecss/node_modules/postcss-selector-parser` | 6.1.2 | 6.1.4 |
| `node_modules/qs` | 6.14.2 | 6.16.1 |
| `node_modules/retry` | 0.12.0 | 0.13.1 |
| `node_modules/rollup` | 4.60.3 | 4.64.7 |
| `node_modules/shell-quote` | 1.8.3 | 1.12.0 |
| `node_modules/sigstore` | 4.1.0 | 4.1.1 |
| `node_modules/socket.io-adapter` | 2.5.6 | 2.5.8 |
| `node_modules/socket.io-adapter/node_modules/ws` | 8.18.3 | 8.21.3 |
| `node_modules/socket.io-parser` | 4.2.6 | 4.2.7 |
| `node_modules/socks` | 2.8.9 | 2.8.10 |
| `node_modules/source-map-js` | 1.2.1 | 1.2.2 |
| `node_modules/spdx-license-ids` | 3.0.23 | 3.0.24 |
| `node_modules/stream-parser` | — | 0.3.1 |
| `node_modules/stream-parser/node_modules/debug` | — | 2.6.9 |
| `node_modules/stream-parser/node_modules/ms` | — | 2.0.0 |
| `node_modules/tar` | 7.5.15 | 7.5.22 |
| `node_modules/thingies` | 2.6.0 | 2.6.1 |
| `node_modules/tmp` | 0.2.5 | 0.2.7 |
| `node_modules/typedarray` | 0.0.6 | — |
| `node_modules/undici` | 7.24.4 | 7.29.1 |
| `node_modules/update-browserslist-db` | 1.2.3 | 1.3.4 |
| `node_modules/vite` | 7.3.2 | 7.3.6 |
| `node_modules/webpack-bundle-analyzer/node_modules/ws` | 7.5.10 | 7.5.13 |
| `node_modules/webpack-dev-server` | 5.2.3 | 5.2.6 |
| `node_modules/webpack-dev-server/node_modules/http-proxy-middleware` | 2.0.9 | 2.0.10 |
| `node_modules/webpack-dev-server/node_modules/ipaddr.js` | 2.4.0 | 2.5.0 |
| `node_modules/websocket-driver` | 0.7.4 | 0.7.5 |
| `node_modules/ws` | 8.20.0 | 8.22.0 |
