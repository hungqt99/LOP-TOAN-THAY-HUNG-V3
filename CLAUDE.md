# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Vietnamese-language exam/testing platform ("Lớp Toán Thầy Hùng") for a math teacher to manage question banks, build exams, run live PIN-based exam rooms, and grade student submissions (including AI-assisted essay grading via Gemini). React 19 + Vite frontend, thin Express backend, Firebase Firestore as the source of truth with aggressive localStorage caching/offline fallback.

## Commands

```bash
npm install         # Node 20+ required
npm run dev         # Vite dev server (also runs the Express+Vite middleware server, see below)
npm run lint        # tsc --noEmit — this is the only "lint"/type-check step, no separate linter
npm run build        # vite build -> dist/
npm run preview      # preview a production build
```

There is no test suite and no `npm start` script defined in `package.json`, even though `Procfile`, `railway.json`, and `render.yaml` all invoke `npm start` to run `server.ts` in production. If working on deployment, this mismatch needs a `"start": "NODE_ENV=production tsx server.ts"` (or built equivalent) added to `package.json`, or the deploy configs will fail.

No standalone dev server for the frontend exists separate from `server.ts` — `server.ts` itself boots Vite in middleware mode (dev) or serves `dist/` statically (prod) alongside the Express API routes on one port.

## Architecture

**Single Express process serves both API and SPA** (`server.ts`). It exposes:
- `/api/ai/grade-essay`, `/api/ai/explain` — call Gemini (`@google/genai`, model `gemini-2.5-flash`) when `GEMINI_API_KEY` is set; otherwise return canned fallback responses. Never assume Gemini is configured — code paths must degrade gracefully.
- `/api/submissions`, `/api/exams`, `/api/rooms/*` — an **in-memory** (non-persistent) store (`Map`/arrays in `server.ts`) used mainly as a secondary sync path / fallback for submissions. This is not the primary datastore.

**Firebase Firestore is the primary datastore**, accessed only from the client (`src/lib/firebase.ts` for init, `src/services/firestoreService.ts` for all reads/writes). Four collections: `users`, `exams`, `submissions`, `liveRooms`. Firestore rules (`firestore.rules`) currently allow open read/write to everything — this is intentionally permissive per the project's README/checklist and expected to be tightened before real production use.

**Every entity has a three-layer sync/cache pattern**, all implemented in `src/services/firestoreService.ts`:
1. `onSnapshot` real-time Firestore listener (source of truth when online).
2. localStorage cache (`edutest_exams`, `edutest_submissions`, `thayhung_users`, etc.) read on mount for instant UI and used as offline fallback.
3. Soft-delete "tombstone" ID sets in localStorage (`edutest_deleted_exams`, `edutest_deleted_submissions`, `thayhung_deleted_users`) — deletions are tracked client-side so a stale Firestore snapshot or merge doesn't resurrect a deleted record. Any new deletable entity should follow this same tombstone pattern (`getDeletedXIds`/`addDeletedXId`), not a plain Firestore delete.

When adding a new synced field or entity, mirror the read-merge-write logic already used for submissions/users in `App.tsx` and `firestoreService.ts` (dedupe by id, then fall back to matching by name/email since offline-created records may not have a real id yet).

**Auth is fully custom, not Firebase Auth** (`firebase/auth` is initialized in `src/lib/firebase.ts` but unused for the actual login flow). `src/context/AuthContext.tsx` implements login/register/session against the `users` Firestore collection + localStorage, with hardcoded fallback passwords (`123456` default, `061091` for the master admin `youtu1501@gmail.com`). Role is one of `admin | teacher | student` (`src/types/auth.ts`), each with a fixed permission set (`ROLE_PERMISSIONS`) plus optional per-user `customPermissions` overrides. Use `useAuth()` (`isAdmin`/`isTeacher`/`isStudent`, `hasPermission(perm)`) for all access checks — don't re-derive role logic elsewhere.

**View routing is a single large state machine in `src/App.tsx`**, not a router library. `MainApp` holds `activeView: ActiveView` and conditionally renders one top-level view component per value (`bank`, `presentation`, `exam`, `analytics`, `leaderboard`, `live`, `admin`, `student_portal`, `practice`). A `useEffect` there enforces RBAC by force-redirecting `activeView` when the current user's role can't access it — extend that effect when adding a new view restricted by role.

**Exam data model** (`src/types/exam.ts`): an `Exam` has 4 question part types (`part_1`..`part_4` = trắc nghiệm/single choice, đúng-sai/true-false, trả lời ngắn/short answer, tự luận/essay), each `Question` scored independently. `checkExamAccessStatus(exam)` centralizes the locked/scheduled-open/scheduled-close/open logic — use it rather than re-checking `isLocked`/`scheduledOpenTime` ad hoc.

**Math/content rendering**: LaTeX via KaTeX (`src/utils/latexParser.ts`, `MathRenderer.tsx`), plus custom parsers for tables (`tableParser.ts`) and TikZ-style figures (`tikzParser.ts`, `tikzProcessor.ts`, `InteractiveFigureViewer.tsx`) so questions can embed geometry figures. `MathScratchpadModal`/`DrawingCanvas`/`StudentScratchpad` provide freehand drawing for spatial-geometry answers.

**Environment variables** (see `.env.example`): `VITE_FIREBASE_*` (client-side Firebase config, required) and `GEMINI_API_KEY` (server-side, optional — AI grading degrades gracefully without it). CI/deploy workflows (`.github/workflows/*.yml`) inject `VITE_FIREBASE_*` from GitHub Secrets at build time since Vite env vars are baked in at build, not runtime.

**Deploy targets**: this repo ships config for three different platforms simultaneously — GitHub Pages (`deploy-github-pages.yml`, static SPA only, no backend/API routes work there), Firebase Hosting (`firebase-hosting-merge.yml` + `firebase.json`), and Railway/Render/Node host (`railway.json`, `render.yaml`, `Procfile`, all running the Express server for full API support). Know which target a change needs to work on — a change that relies on `/api/*` routes won't function on the GitHub Pages deployment.
