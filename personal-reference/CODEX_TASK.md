# Codex task: personal Kept integration (do not deploy)

## Outcome

Prepare a **self-buildable, maintainable** personal edition of Kept by combining the owner's six pending contributions and the actual production customizations. Work autonomously on a separate Git branch/worktree, run available tests, and push **only** a reviewed integration branch in the owner's fork. Never access or modify VM 104 production; it is not available from this workspace.

### Inputs

- Local Windows repository: `C:\codex-projects\kept`.
- Original upstream: `ericerkz/kept`.
- Owner's fork: `Trevianos/kept-contrib`, expected remote `contrib`.
- Reference branch in fork: `personal/customizations`. Its `personal-reference/` contains the **actual** historic production Dockerfile and UUID polyfill, and a file inventory. It is not a production-ready build.
- Binary branding may be supplied locally as `kept-branding-assets.zip`; import the **exact** five files from that zip under `personal-reference/branding/` and confirm their SHA-256 checksums against `personal-reference/README.md`. If absent, continue only with safe non-branding work and report BLOCKED for production completeness. Do not invent artwork.
- Current production container used image `kept-fontfix:local`, with persistent data outside the image. Its actual instance must remain untouched.
- Six PRs in the fork, each based initially on upstream `master` commit `50619c520c2506ad351a43e25e3183ba6847a291`:
  1. #93 `fix/pinned-icon-outline` (`650a850c6e7fb4da33133a2bbb000b716dd09b81`)
  2. #94 `fix/sidebar-scroll` (`915d76db073418225169363be64224bcf35bc012`)
  3. #95 `fix/latin-character-rendering` (`75710d33676657d897411c3c28162fd50a68bb12`)
  4. #100 `fix/sidebar-active-unicode` (`b5525b1b12f63d578f72e67a61a506c0d6e5ce5d`)
  5. #101 `fix/note-card-actions-contrast` (`ec1c39d3771761332b739b83801ce3faf3fd672b`)
  6. #102 `fix/profile-navigation-cleanup` (`6d2227581fc732e20c4f6c75a9bcee26f1d86354`)

### Work plan

1. Fetch the upstream and fork safely. Check clean working tree; never discard or overwrite user changes. Create a worktree and/or new branch `personal/integration` based on current upstream master after checking its relationship to the PRs. Preserve each PR as its own branch and history; do not rewrite them.
2. Integrate all six PRs (including tests and test fixtures). Preserve both sides of conflicts; expected overlap in `sidenav`, `navbar`, `settings`, `styles.scss`, and `link-preview`. Do not leave duplicate CSS or regress theme behavior.
3. Incorporate the production customizations in **source** rather than patching `dist/keep`: logo, favicon, PWA assets incl. Apple 180px icon, orange `#FFA726` Kept wordmark (Arial, weight 600, ~26px, no text shadow), originally customized accent color `#feefc3` -> `#FFA726`, and HTTP `crypto.randomUUID` fallback using `crypto.getRandomValues`. Preserve functioning HTTPS / web workers / PWA. Carefully review globally replacing colors and instead implement intentional design tokens as appropriate. Make the differences visible and easy to change in source.
4. Resolve overlap of old production Arial title fallbacks with PR #95's KeptSans/font remediation. Actual goal: no damaged Czech accents, consistent typography in navigation, note titles and editor.
5. Ensure a clean new-image Docker build from the integrated source with no runtime patching. Treat the legacy Dockerfile/Compose as references, **not** as deployment instructions. Do not include machine-specific network details, credentials, SQLite databases or personal instance state.
6. Verify build/PurgeCSS, `git diff --check`, all relevant existing Angular tests incl. those added by the PRs, backend tests where feasible, light and dark theme styles, role guard checks, font loading, brand assets, note save with `crypto.randomUUID` unavailable, secure HTTPS behavior, and regressions. Use an isolated dev environment if tests need a server, not production. Do not claim tests that did not run.
7. Add `docs/personal-customizations.md` explaining each ported change and how to reproduce it; add deployment notes with immutable/tagged Docker images, independent staging, SQLite + attachments/config backups, preservation of /app/data and environment, and rollback to the old `kept-fontfix:local` image. Do not change real Compose, restart containers, or deploy.
8. Scan staged files for credentials or identifiers and review licenses, particularly font assets and original MIT notices. Do not overwrite master, upstream branches, or existing PRs. Commit only on `personal/integration`; push to `contrib` only when safe and tests pass.

### Final report

Provide the SHA and link to `personal/integration`, traceability for all six PRs, list of resolved conflicts, exact files changed, successful and failed tests, imported branding asset hashes, any missing material and unresolved risks. Clearly state whether it is safe to proceed with *manual staging tests* on `kept-test`. Never automatically declare it production ready.
