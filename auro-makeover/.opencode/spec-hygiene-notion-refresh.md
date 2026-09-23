# Spec: Hygiene + Notion Refresh (Stage 1 of 3)

**Status:** DRAFT — awaiting sign-off. Do not implement until approved.
**Date:** 2026-09-23
**Follows:** user decision "All three, in order" (hygiene+Notion → geo-routes spec → red tests).
**Rule adopted:** spec-first per session; this file is the pattern for stages 2–3.

## Goal
Leave the repo committable and the Notion hub truthful, with zero source-behavior changes:
1. Working tree contains only intentional changes (junk removed, `.gitignore` restored, required assets kept).
2. Notion hub (root `3e381624-7586-8186-b45c-f59f63907290`) matches verified repo reality: Phase 1 green, Phase 2A/2B built, Phase 3 in progress.
3. Spec-first workflow recorded in `AGENTS.md` so future sessions follow it.

## Non-goals (explicitly out of scope)
- No changes to `src/` behavior, no new features, no test edits.
- No Prisma migration (the Phase 2 page claims `Lead.styleQuizAnswers` etc. were added — they were not; the API uses a Prisma 8 dynamic import + `src/types/prisma.d.ts` stub. The Notion page gets corrected, not the schema).
- No commit is made in this stage (commit happens after stage-2/3 sign-off; tree is left clean and reviewable).
- Stages 2 (geo-routes spec) and 3 (red tests) get their own spec files after this stage lands.

## Research already done (do not redo)
- `git status`: 10 modified tracked files, 13 untracked paths; `D auro-makeover/.gitignore` (41 lines, original content recovered from `HEAD:auro-makeover/.gitignore`).
- Junk confirmed: `auro-makeover/test-out.txt`, `auro-makeover/build-out.txt`, `auro-makeover/tsconfig.tsbuildinfo`, `Aura/.FullName` (parent dir, outside app).
- Keep confirmed: `public/images/*.jpg` (7 files, ~6MB, referenced by Hero/Gallery/Showcase — required runtime assets), `next-env.d.ts` (generated; covered by restored gitignore).
- Notion staleness verified by reading pages: Roadmap M5 says "tests 52/70 ❌", fonts "never loaded ❌", M2/M3 list failures that are fixed; Architecture describes DM Sans/Inter + drifted hero, omits `quiz/`, `api/`, `[city]/`, `StyleQuiz`, `VisualizeRoom`, `cities.ts`, `quiz-to-tags.ts`; Phase 2 checklist all unchecked though all items exist.
- Test gap confirmed (for stage 3): zero matches for `quiz|visualize|restyle|cities|[city]` in `scripts/test-e2e.mjs` and `tests/e2e-requirements.test.ts`.
- Known Notion API quirks: `insert_content` takes key `content` (not `new_str`); plain-text backslashes are stripped (use `/` or code spans); bare `TEST_READY.md`-style underscore names get linkified (wrap in backticks).
- codemesh `memory.write` is denied in this workspace — plan/state lives here (`.opencode/`) and in Notion, not in codemesh memory.

## Affected files
| Action | Path |
|---|---|
| Delete | `auro-makeover/test-out.txt`, `auro-makeover/build-out.txt`, `auro-makeover/tsconfig.tsbuildinfo` |
| Delete (needs explicit sign-off — outside app dir) | `Aura/.FullName`, `Aura/.gitignore` (untracked parent-dir strays) |
| Restore byte-identical to HEAD | `auro-makeover/.gitignore` (content recovered; blocks `*.tsbuildinfo`, `next-env.d.ts`, `.next/`, `.env*`) |
| Keep, do not touch | `public/images/*.jpg`, `next-env.d.ts`, all `src/` additions |
| Append spec-first rule (~10 lines) | `auro-makeover/AGENTS.md` |
| Update via `update_content`/`insert_content` | Notion: Architecture, Roadmap & Milestones, Phase 2 page; root status callout |
| Create (only if Roadmap update needs it — decision below) | Notion child page "Phase 3 — Geo Routes" under root |

## Expected behavior
1. **Hygiene:** after deletions + `.gitignore` restore, `git status --short` shows only: 10 modified tracked files, `src/` additions, `public/images/`. No `.txt` logs, no `.tsbuildinfo`, no parent-dir strays.
2. **AGENTS.md:** gains a short "Spec-first workflow" section (research → `.opencode/spec-<slug>.md` → sign-off → fresh-session implement red→green → linters → `/verify` → update spec). No other AGENTS.md changes.
3. **Notion Architecture:** module map gains rows for `src/app/quiz/`, `src/app/api/leads/quiz/`, `src/app/api/ai/restyle/`, `src/app/[city]/`, `StyleQuiz.tsx`, `VisualizeRoom.tsx`, `src/lib/cities.ts`, `src/lib/quiz-to-tags.ts`; layout/fonts row corrected to Syne + Plus Jakarta Sans; hero row de-drifted.
4. **Notion Roadmap:** M5 row corrected to tsc ✅ / tests 70/70 ✅ / build ✅ (verified 2026-09-22); M1 fonts corrected to loaded ✅; M2/M3 drift notes removed; acceptance checklist Build boxes checked; "Future updates" backlog kept, Phase 2A/2B marked COMPLETED.
5. **Notion Phase 2 page:** checklist boxes checked for all built items; data-model section corrected (no migration occurred; dynamic import + stub types); add "un-migrated — DB wiring is backlog #8" note.
6. **Root status callout:** updated to current verified state (70/70, tsc/lint/build green, Phase 3 geo-routes in progress).
7. **No `src/` file is modified** in this stage (verify with `git diff --stat src/` empty at end).

## Acceptance criteria
- [ ] `git status --short` shows no `test-out.txt`, `build-out.txt`, `tsconfig.tsbuildinfo`, `../.FullName`, `../.gitignore`
- [ ] `git diff auro-makeover/.gitignore` is empty (byte-identical restore)
- [ ] `git diff --stat src/` is empty (no source changes)
- [ ] AGENTS.md contains the spec-first rule section
- [ ] Notion Architecture/Roadmap/Phase-2/root-callout read back with corrected content (retrieve + spot-check, no mangled paths or linkified filenames)
- [ ] `npx tsc --noEmit` still exit 0 (run last; delete regenerated `tsconfig.tsbuildinfo` afterwards — `incremental:true` recreates it)

## Risks
| Risk | Mitigation |
|---|---|
| Deleting `Aura/.FullName` / `Aura/.gitignore` affects something outside the app | Both are untracked strays; flagged here for explicit sign-off before touching |
| Committing 6MB of jpgs later bloats repo | They are required runtime assets (`/images/*.jpg` referenced in code); no alternative in this stage |
| Notion markdown mangling (paths, filenames) | Code-span all paths/filenames; read back every edited page |
| `tsc --noEmit` recreates `tsconfig.tsbuildinfo` | Delete it as the final step; acceptance checks order matters |
| Scope creep into stage 2/3 work | Hard boundary: no `src/`, no tests, no commit in this stage |
