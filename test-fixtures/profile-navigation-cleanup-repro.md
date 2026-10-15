# Profile navigation cleanup (planned)

## Current behavior

- `Users/Admin settings` and `Sign out` in the sidebar duplicate top-bar/profile controls.
- Administrators see an additional `Users` link in the desktop top bar.
- The avatar dropdown is a large profile editor (avatar, display name, password reset, settings, sign-out).

## Intended behavior

- The avatar dropdown becomes a compact navigation menu with `Users` (admin only), `Settings` (all authenticated users) and `Sign out`.
- Move avatar upload/removal, display name editing and password management into a `Profile` section at the beginning of `/settings`.
- Remove duplicate sidebar admin/sign-out entries and the top-bar Users link.
- Keep existing authentication, route guards, backend authorization and all unrelated functionality.
- Check desktop/mobile, light/dark themes, click-away closing, account roles, and logout.

This file seeds the branch for a **draft PR and screenshots before implementation**. Codex should implement and test the changes in this branch, preserving or updating this document.

## Implemented and automated validation

- Avatar navigation now contains only Users (admin), Settings, and Sign out.
- Settings starts with Profile and reuses the existing self-profile/password APIs and session updates.
- Duplicate navigation and obsolete profile-menu styles/handlers were removed; mobile theme switching remains.
- Production build and 15 Angular regression tests passed. Tests cover role-based navigation, route guards, menu closing, logout, avatar resizing/removal, profile saving, and password validation/errors.
- Authenticated end-to-end checks and manual desktop/mobile light/dark visual review remain pending on the isolated kept-test instance on VM 104. No deployment was performed.
