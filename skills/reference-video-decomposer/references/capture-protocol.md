# Fidelity capture protocol

This protocol is required when the goal is to recreate a reference closely. It is designed to prevent a polished but generic result caused by reading only a few contact-sheet frames.

## 1. Inventory

Record source path, duration, width, height, pixel aspect, frame rate, video codec, audio stream count, sample rate, channel layout, and loudness. If a stream is corrupt or truncated, isolate or re-encode the usable stream and record that decision.

## 2. Temporal atlas

Create two layers of evidence:

- coarse atlas: one frame every 0.20–0.50 seconds for navigation;
- event atlas: every detected cut plus high-change intervals from image difference or optical flow.

For every event, capture frames before, at, and after the change. Use a minimum window of -0.20 to +0.20 seconds and prefer 1–2 frame spacing around the peak. Include the first stable frame after an entrance and the last stable frame before an exit.

## 3. Event ledger

Use one row per important element or transition:

`id | start | peak | settle | end | state | motion | easing | overshoot | audio cue | confidence`

State must describe what is visible. Motion must describe what changes. Do not collapse a multi-step entrance into “fade in” when it actually contains crop, scale, blur, rotation, and settle.

## 4. Measured visual details

For each element, record normalized values relative to the frame:

- bounding box and anchor point;
- scale, rotation, crop, perspective, and focal point;
- z-order and occlusion relationships;
- fill, stroke, gradient, shadow, blur, glow, grain, and blend treatment;
- corner radius and spacing;
- text content, case, line breaks, alignment, tracking, weight, and approximate font class;
- logo geometry, product silhouette, and image source/treatment.

If a supplied logo, product image, UI screenshot, or font exists, use it. Do not replace a distinctive asset with a generic CSS illustration without marking the fidelity loss.

## 5. Audio alignment

Make a cue ledger for hits, whooshes, ticks, holds, speech starts, pauses, and resolves. Align cues to visible events with timestamps. Preserve the source audio as a reference asset or separate track; never hide timing assumptions inside a composition.

## 6. Reconstruction review

Render an initial pass, then compare it with the reference at identical timestamps. Review:

1. timing and cut positions;
2. composition, scale, crop, and safe-area placement;
3. identity assets and typography;
4. motion path, easing, overshoot, and settle;
5. color, texture, glow, shadow, and polish;
6. audio sync and loudness.

Inspect both full size and phone size. Review seam frames around every cut, not only keyframes. Log each mismatch as `observed reference`, `current render`, `next correction`, and `priority`.

## Required handoff

Before final delivery, keep the inventory, shot breakdown, event ledger, measured-element sheet, cue ledger, first-render comparison, and fidelity risk list alongside the editable HyperFrames project. The source video remains read-only and is never copied into the plugin package.
