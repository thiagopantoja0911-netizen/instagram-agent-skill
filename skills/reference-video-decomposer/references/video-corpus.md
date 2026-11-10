# Aulas Motion Reference corpus

This plugin originally encoded a 10-video corpus analyzed in the project workspace. The detailed original project report is available at `video-analysis/REFERENCES.md`; this compact reference is the reusable style layer. **Revision 0.3.0 adds 3 user-supplied source videos (13 total).** See `2026-11-three-reference-analysis.md` for the separately observed facts.

## Common language

The recurring language is premium motion-design advertising mixed with tutorial pacing:

- vertical-first compositions with safe central typography;
- rounded cards, UI widgets, screen mockups, and product cutouts;
- clean light grounds alternating with graphite or saturated color grounds;
- purple, neon green, blue, coral, and pink accents used as purposeful state colors;
- kinetic copy in short phrases, often with a small rotation or perspective skew;
- soft shadow, blur, glow, bloom, parallax, and gentle overshoot;
- fast beat-driven cuts for demos, with calmer holds for CTA and logo lockups;
- end cards that resolve to one clear word, logo, or short promise.

### New evidence from three additional references, 10 Nov 2026

- **R11 Product/finance:** geometric motif continuity, product/phone grow-and-rotate, phone UI punch-in, lilac glow, circle wipe, CTA chip and end-card dissolve.
- **R12 Widget/ASMR:** state changes **inside** one scene (reflow, counter, calendar, battery, clock, car charging, map, call), 60 fps, tiny contact/settle moments and continuous camera drift. It is not just a set of cards that enter/leave.
- **R13 Process/portfolio:** alternate proof-of-work footage and authored motion (sketches, timeline, result), kinetic typography, changing scale, editorial white space, product/diagram sequences and measured arc-to-logo resolution.
- **New requirement:** never build one static giant headline per 2–4 seconds and call it premium motion. Use `stateful-ui-widget`, `voice-anchored-kinetic`, `motif-match-cut`, and `micro-sfx-cue-track`. See `microinteractions-audio.md` **before** any new video from this corpus. All time parameters in that file are proposed defaults unless explicitly marked observed.

## Preset families

### Editorial UI

Use `soft-card`, `dark-card`, `ui-orbit`, `stateful-ui-widget`, `screen-punch-in`, and `pill-cta`. Best for widget, finance, music, and product-interface references.

Parameters: `ground`, `cardRadius`, `shadowOpacity`, `accent`, `stagger`, `parallaxDepth`, `ctaText`, `state0`, `state1`, `widgetSounds`.

### Kinetic editorial

Use `kinetic-copy`, `voice-anchored-kinetic`, `parallax-collage`, and `brand-end-card`. Best for white-space typography, metaphor pieces, and minimal tutorials.

Parameters: `fontFamily`, `fontWeight`, `lineHeight`, `tracking`, `entryAxis`, `rotation`, `hold`, `accentBlock`, `spokenAnchor`.

### Neon product

Use `neon-product`, `motif-match-cut`, `pill-cta`, and `brand-end-card`. Best for Nubank-like product concepts and premium app advertising.

Parameters: `groundColor`, `haloColor`, `haloRadius`, `bloomStrength`, `productScale`, `ctaColor`, `endCardDuration`, `morphSource`, `morphTarget`.

### Scrap / warp

Use `parallax-collage` and `beat-cut-sequence`. Best for high-energy visual scraps with grids, cutouts, warning icons, and radial zoom.

Parameters: `cutTimes`, `warpStrength`, `gridOpacity`, `shapeCount`, `palette`, `focalPoint`, `shakeAmount`.

### Tutorial capture

Use `screen-punch-in`, `kinetic-copy`, and `brand-end-card`. Best for Alight Motion and After Effects tutorials.

Parameters: `screenSrc`, `crop`, `zoom`, `highlightRect`, `instruction`, `pauseDuration`, `ctaText`.

## Sound cue vocabulary

Represent audio as explicit cues rather than hidden timing assumptions:

- `beat`: a cut or card state change;
- `hit`: a short impact for a product/card arrival;
- `whoosh`: a pan, zoom, warp, or large text move;
- `tick`: a small UI state change;
- `hold`: a quieter interval for readable copy;
- `resolve`: a final tail for the end card;
- `tap`: a small contact press;
- `swish`: a small card travel;
- `micro_sfx`: any short event with an actual screen cause and known timestamp.

All cue times must be deterministic and editable. If source audio is supplied, preserve it as a reference or separate media asset; do not assume the plugin owns the original track. Extracted RMS peaks are **candidate audio events**, not confirmed effect types or named music.

## Relevant files in current release

- `2026-11-three-reference-analysis.md`: 3 case breakdowns, selected micro-frame evidence, measured audio onsets and fidelity risks.
- `reference-event-ledgers.json`: exact machine-derived event inventory; note that candidate times are quantized to 125 ms (video) and 20 ms (audio).
- `microinteractions-audio.md`: NEW procedural requirements, parameter defaults and QC checklist for synced motion.
- `capture-protocol.md`: mandatory capture and reconstruction procedure.

## Diagnostic correction, 10 Nov 2026 (v0.3.1)

See `render-diagnostics.md` for the V5/V5.1 failures and mandatory minimisation-and-rebuild protocol. A renderer job reaching 22% and reporting HyperFrames exit code 1 with truncated tail is not a completed render; do not assume that the audio portion is the cause when the audio validator reports zero errors.

### v0.3.2 incident learning

The Windows Connector 2.0 worker truncates the failing check report before it reaches the MCP. See `render-diagnostics.md` for a confirmed source-code diagnosis, the read-only full-log recovery method, and the pending V5.2 investigation. Do not infer the root cause from the last 800 characters of a JSON report.

## Evidence from rendered outputs — 10 Nov 2026

The four V8 MP4 renders are **technically complete but fail creative QA**: near-identical single-card UI structure across A/B/C/D, inadequate scene variety, an empty caption handoff in V8D at 20.8 s, inconsistent loudness (-11.86 to -17.50 LUFS), and 1.1–2.0 s terminal audio gaps. **Do not choose V8 as the premium default.** Review `v8-output-qa-2026-11-10.md` and its 8-event word-to-frame sync and audio gate before any V9. Preserve R11–R13 references; distinguish observed output defects from proposed fixes.
