---
name: reference-video-decomposer
description: Use when the user sends one or more videos as visual references and wants a scene-by-scene breakdown or reusable HyperFrames motion system.
---

# Aulas Motion Reference

Use this workflow to inspect reference videos, extract the recurring visual language, and turn it into editable HyperFrames primitives. Read `references/video-corpus.md` before adding a new reference or composing from the existing system. For faithful recreation work, also read `references/capture-protocol.md` and complete every capture pass before authoring.

## Operating rules

- Treat source videos as read-only reference material.
- Never invent a scene, audio event, logo, or brand token that was not observed.
- Keep each reference separate from the cross-video style system; isolate one-off details as optional presets.
- Preserve the source aspect ratio when it is part of the look. Do not force everything into 16:9.
- Prefer editable HTML scenes and variables over baked screenshots.
- Use real supplied product/UI imagery when the user asks for a faithful recreation; otherwise use neutral placeholders.
- Separate observed facts from implementation choices. If a logo, product, font, or image is distinctive, preserve it or explicitly flag the substitute.
- Never treat a coarse contact sheet as the final analysis; it is only a navigation index.

## Per-video workflow

1. Catalog duration, dimensions, frame rate, codecs, every audio stream, and approximate loudness; note corrupt or truncated streams instead of silently trusting them.
2. Build a coarse atlas for navigation, then detect scene cuts and high-change intervals.
3. Micro-sample each cut and motion event on both sides of the transition (at least ±0.20 s, ideally every 1–2 frames) to capture the actual entry, peak, overshoot, settle, hold, and exit.
4. Describe the shot progression in plain language with frame-accurate time ranges and a confidence level for each observation.
5. Record layout as measurable data: normalized bounding boxes, anchor/focal point, scale, rotation, crop, safe-area relationship, z-order, masks, radius, shadow, blur, glow, and color values.
6. Read identity details: exact text/case/line breaks, font category and weight, logo geometry, product silhouette, image treatment, and any distinctive mark. Use supplied source imagery whenever available.
7. Extract camera language: pan, orbit, punch-in, parallax, perspective skew, warp, hold, cut, match cut, or dimensional transition.
8. Extract rhythm as explicit events: beat cuts, holds, acceleration, stagger, overshoot, settle time, and continuous drift. Store `start`, `peak`, and `end` for important elements.
9. Extract audio structure: speech/music/ASMR likelihood, transients, pauses, and likely cue points. Do not claim a transcription without one. Align visible events to cues, not just scene boundaries.
10. Map observed patterns to existing primitives before proposing a new primitive, then render and compare at matching timestamps before calling the reference understood.

## Fidelity capture pass

Use the mandatory protocol in `references/capture-protocol.md`. The minimum evidence package is: metadata inventory, coarse atlas, cut/event ledger, micro-frame sheets around transitions, element measurements, audio cue ledger, and a side-by-side review of the first render. Keep “observed” and “proposed” fields separate so a clean implementation does not get mistaken for a captured fact.

## Reusable primitive library

- `soft-card`: rounded cream/white card, soft shadow, scale-in.
- `dark-card`: graphite/black contrast card for UI.
- `kinetic-copy`: short text with position/scale/blur/rotation variants.
- `ui-orbit`: coordinated widget/card rearrangement.
- `neon-product`: isolated product, colored ground, halo and bloom.
- `screen-punch-in`: screen recording or mockup with crop and zoom.
- `parallax-collage`: layered cutouts, grids, and perspective warp.
- `pill-cta`: rounded CTA with subtle overshoot.
- `brand-end-card`: clean logo/title lockup.
- `beat-cut-sequence`: deterministic sequence driven by explicit cue times.
- `detail-locked-rebuild`: a scene assembled from measured reference coordinates, explicit event times, and supplied identity assets; use it when fidelity matters more than generic style matching.

## HyperFrames authoring contract

When implementing a preset in a HyperFrames project:

- Put each scene in its own sub-composition and keep markup, style, and scripts inside its template.
- Give every timed element a stable id, `class="clip"`, `data-start`, and `data-duration`.
- Register a paused timeline after all tweens as `window.__timelines["<data-composition-id>"] = tl`.
- Make duration the root `data-duration`; use deterministic time and seeded values only.
- Animate transform properties through the timeline, not CSS `left`, `top`, `width`, or `height` on GSAP-controlled elements.
- Keep media timing on the media element. Do not play, pause, or seek media in the composition.
- Use bundled fonts or local `@font-face` files and asset paths beginning with `assets/`.
- Route footage treatments such as blur, grain, grades, and vignettes through `media-treatment`.
- Keep text in title-safe and important motion in action-safe bounds.
- For faithful work, compare the authored render and reference at identical timestamps, inspect at phone size and full size, and revise the largest mismatch first: timing, composition, identity, motion, then polish.

## Deliverables

For each new reference, produce:

- a concise inventory row;
- a shot/timing breakdown;
- an observed-pattern list;
- a mapping to existing primitives;
- any genuinely new preset, with parameters and a neutral example;
- a note separating observed facts from implementation suggestions.
- a fidelity risk list identifying anything approximated, missing, or not verifiable from the source.

Update the corpus reference when a new video adds evidence. Bump the plugin patch version for additive reference updates and the minor version when adding a new primitive or workflow capability.
