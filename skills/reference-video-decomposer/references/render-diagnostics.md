# Render diagnostics, logging and regression loop — v0.3.1

## Incident 2026-11-10 — V5

**Confirmed findings, not guesses:**
- Video renderer worker online and able to accept jobs.
- V1–V4 rendered MP4 successfully but did not pass subjective audio/visual review (reported 4/10).
- V5 job `9872c2f3a29a949db765069e639f631d` failed during HyperFrames check at 22% (`exit code 1`); no MP4 was produced.
- V5.1 job `f5ae22f19d7fa397261e0cd3ddf56543` also failed at 22% (`exit code 1`). It used 8 compositions, 19 foley events from four local WAV assets, and a female voice, but no media was saved.
- The MCP `error_message` for both jobs has a roughly 800-character **truncated tail** of a JSON report. The visible audio report says `ok: true`, `errorCount: 0`; this is **not enough** to diagnose the underlying exit code.
- A minimal HyperFrames test job `eda29259aad8d8c205c476a468ba0ae7` was queued to isolate the problem. Do not infer its outcome without a fresh status read.

## Mandatory recovery procedure

1. Preserve job ID, worker version, runtime version, full source package, timestamp and output paths. Never overwrite the failed source artifact without versioning.
2. Reproduce with the smallest composition that exercises the failing property: one HTML template, one paused GSAP timeline, one valid host, one short motion. No audio at first. Run `hyperframes check --json` before render.
3. Capture **full stdout and stderr** and the `check --json` file locally (do not truncate to the last 800 characters); classify `lint`, `runtime`, `layout`, `audio` findings separately. A visible audio check of zero errors does not clear the layout or lint check.
4. Add controlled increments: second scene; state changes; audio voice; one local WAV foley; multiple cues; full composition. Gate each addition on check success and keep an issue ledger.
5. For each timed element: `class="clip"`, `data-start`, `data-duration`; for each subcomposition: valid ID, template root, paused timeline registration. Animate GSAP transforms/opacity, not CSS reflow properties (`width`, `height`, `letterSpacing`, `left`, `top`). Use real seek-based evaluation.
6. Do not substitute audio URLs that will expire for packaged final assets. A voice anchored only to estimated sentence timings is a prototype, not verified sync; measure or transcribe true word timing.
7. Compare the fixed render at 8+ chosen timestamps against the reference: motion continuity, UI state, contact sound timing, speech alignment and quiet holds. Then check peak and loudness. Record both automated pass and human visual approval separately.
8. Only call the work `corrigido/approved` after `check` passes, job reaches `completed`, MP4 exists and audio/image are inspected. `queued`, `processing`, and a guessed root cause are not success.

## Regression gates

- Minimal scene passes check; animation has a visible before-action-after state.
- Full version passes all blocking checks, no missing or unseekable assets.
- No long slide-like holds disguised by zoom or glow; at least 3 distinct functional interactions are visible.
- Every audible microcue is linked to a visible action, with local asset, cue time, measured gain and acceptable overlap with voice.
- Keep a changelog entry in Notion and Google Drive after every test. The reusable technical lesson belongs in this plugin; private/source clips are not packaged.

## Incident ledger

| Job | Build | Confirmed result | Next step |
|---|---|---|---|
| `9872c2f3a29a949db765069e639f631d` | V5 | failed at 22%, HyperFrames exit 1 | obtain full check report |
| `f5ae22f19d7fa397261e0cd3ddf56543` | V5.1 | failed at 22%, HyperFrames exit 1 | isolate with minimal project |
| `eda29259aad8d8c205c476a468ba0ae7` | diagnostic | awaiting final confirmation at time of writing | query job; record actual outcome |

## Reproduced 22% check failure and connector log truncation (verified in source, 2026-11-10)

- Job `5ec3951cd373d89883e2fd07ae615318` (V5.2) also failed during `check --json` at 22%, with HyperFrames exit code 1 and a shortened tail showing text-size/legibility entries. **This does not prove a specific lint or layout root cause.** A failure cannot be fixed reliably with a cropped JSON suffix.
- **Confirmed source of truncation:** repository `thiagopantoja0911-netizen/Secretssysten`, branch `feat/videos-secrets-connector-v2-clean`, `apps/videos-secrets-connector-v2/worker.mjs`: `runHyperFrames` keeps the last 6,000 characters of stdout/stderr; on error returns `tail.slice(-1700)`; `handle` posts only `String(e.message).slice(0,800)` to `/api/worker/jobs/.../fail`. Thus the first blocking JSON finding is systematically lost when the full `check` report is large.
- `worker.mjs` saves project sources to `%USERPROFILE%\Videos\MeusProjetos\Projetos\<slug>-<jobid>` and the installed CLI resides under `%LOCALAPPDATA%\Programs\VideosSecretsConnectorV2\runtime\node_modules\hyperframes`. **No reinstalls or token changes are required to read check results from these existing files.**
- A safe, local-only support package `Diagnostico_V5_HyperFrames.zip` was prepared to run the installed CLI with `check --json` on the preserved V5.2 project and write both full JSON and a filtered error summary to Downloads. It does not read tokens or post logs to a server. **It has not been executed on the user's notebook yet**; ask for the summary before changing more animations.
- Minimal diagnostic job `eda29259aad8d8c205c476a468ba0ae7` reached `completed` 100%, MP4 size 344,700 bytes. This rules out a blanket failure of simple UI composition rendering, but not the cause in complex scenes.
- Future worker improvement recommendation (NOT deployed): have the worker parse the `check --json` result and extract `ok: false` findings, error codes, source paths, and bounded error details into the job message or downloadable artifact. Do not upload the entire potentially sensitive runtime log by default.

## Successful constrained template and independent acceptance gate (2026-11-10)

See [`safe-area-clip-regression.md`](safe-area-clip-regression.md). A single persistent UI composition with safe-area copy and disjoint phrase clips has passed HyperFrames validation (V7.1 and V8B); V8B completed render with a female voice and seven local microcues. This DOES NOT certify artistic quality or exact sync. Record all V8 jobs as complete only after a fresh get_video check.

## V8 final status

All four jobs V8A/B/C/D completed in the renderer. The job IDs and file sizes are listed in `safe-area-clip-regression.md`. Approval for quality and precise sync is still pending.
