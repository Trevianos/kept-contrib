# Kept production customizations (reference only)

These are **reference files** from the user's VM 104 production setup, supplied on 2026-10-16. They are **not applied automatically** by this branch. This branch deliberately keeps upstream `master` code unmodified.

## Verified source and behavior

Production container: `kept-app`; image: `kept-fontfix:local`; data mounted separately at `/opt/apps/kept/data -> /app/data`.

- `Dockerfile.fontfix`: extends upstream's published Docker image and patches compiled Angular output. It includes Arial fallbacks for note titles, orange Kept wordmark (hex `#FFA726`), the global `#feefc3` accent replacement, PWA/icon swaps and an HTTP UUID fallback script.
- `uuid-polyfill.js`: builds an RFC 4122 version-4-style UUID using `crypto.getRandomValues` when `crypto.randomUUID` is unavailable. Loaded before the Angular scripts to support non-secure LAN HTTP contexts.
- `docker-compose.override.yml`: previous local build override. **Do not deploy it as-is**: it produces a legacy image by patching compiled upstream assets.
- The original `docker-compose.yml` was inspected but **not published**: it contains machine-specific LAN network binding. Its essential non-secret settings were ports 6767, SQLite under `/app/data/kept.sqlite`, and persistent volume `./data:/app/data`. Preserve the existing production Compose and environment during deployment.

## Original binary branding assets (must be supplied separately)

The uploaded verified archive also includes the following *exact* user-provided assets. They are **not yet committed to this branch**; do not manufacture replacements. To make the integration complete, first import these exact files from the accompanying `kept-branding-assets.zip` into `personal-reference/branding/`:

| File | Dimensions | SHA-256 |
| --- | --- | --- |
| `branding/kept-logo-128.png` | 128×128 | `73dc6efed7b8e2b403a8c39d93cb3a789fdacf72599cc70cb98c7d75d8907b1d` |
| `branding/kept-icon-180.png` | 180×180 | `70001c6a3ebfba37a0a30961d13d6603c9408f4614d85a84de9afc3746c47c60` |
| `branding/kept-icon-192.png` | 192×192 | `bf48fa0f31712e2062174e4a2b3e03871afe02849a7c619198d06787742477a7` |
| `branding/kept-icon-512.png` | 512×512 | `66d5595080cd46e9d1f22cb07b31fe0db17bef2a89ea790d8060f78e20c7dd4b` |
| `branding/favicon.ico` | favicon | `5865477f1cc068182ec13d1e6ddfe76ae7f8fa71652ff3ee75a8ab1fb2a0af71` |

## Codex integration task

Integrate six independently submitted Kept PRs #93, #94, #95, #100, #101, #102 into a separate `personal/integration` branch, **without modifying any upstream/PR/master branches**. Then port these production customizations **into source** (Angular source assets, styles, startup/polyfills and manifest), rather than modifying `dist/keep` after build. Use these files as *behavioral reference*, not deployment recipes.

Check that the combined build retains correct Czech diacritics despite the overlapping font fix in PR #95. Check both dark/light themes, navigation, icons, branding, HTTP note save, HTTPS, persisted note data and MCP compatibility. Preserve copyright and font licensing notices. Do not publish secrets, local network addresses or user data. Verify build and regression tests on an isolated local environment; never deploy, change production databases or touch the user's `kept-app`. Document a staged upgrade and rollback to `kept-fontfix:local`. Do not mark the integration ready for production until the actual binary assets have been verified and imported, and full UI testing is done on `kept-test`.

This directory can be removed from a future distributable release after the source-level migration is complete and documented.
