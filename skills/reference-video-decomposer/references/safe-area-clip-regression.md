# HyperFrames: timed copy, micro-SFX and Reels safe area — regression 2026-11-10

**Evidence level:** render/job observations. These are not yet visual or auditory approvals.

## Controlled experiment

- V5 `9872c2f3a29a949db765069e639f631d`: FAILED at `check --json`, progress 22%, exit 1, diagnostic truncated.
- V5.1 `f5ae22f19d7fa397261e0cd3ddf56543`: FAILED at 22%, same truncated error.
- V5.2 `5ec3951cd373d89883e2fd07ae615318`: FAILED at 22%, same truncated error.
- Minimal scene `eda29259aad8d8c205c476a468ba0ae7`: COMPLETED 100%, 344700 byte MP4.
- Minimal scene + female narration `1861729526377d49ef4c8a2f55010f03`: COMPLETED 100%, 809379 byte MP4. This isolates voice alone as compatible in this setup.
- First complex single-scene test `d2ba40a0b91555b4672133df59e87e30`: FAILED at check with 5 checks not passed. Full report not exposed by Connector 2; do not claim precise root cause.
- Safe-area-focused revision `86ef6e1a7ce8eb9082d526378b219b57`: COMPLETED 100%, 1,898,482-byte MP4. It removes text placed below the safe area, limits overlapping copy and keeps one interactive UI composition. This is a validated mitigation, **not a proven explanation of the previous lint/layout failure**.
- Narrated micro-SFX + separated caption intervals `748732ad4c8c9dbb317e145c78916341`: COMPLETED 100%, 1,996,305-byte MP4. 7 spoken-phrase blocks and 7 sparse SFX cues. Sound/image synchronization is programmed but not yet measured from the final MP4.
- Additional variants: V8A `3c408c3325181383437b643ea895f796`, V8C `783c7debc552f196f527a802d71cc3b3`, V8D `6a2bfd75b9396d4283c7f934ff598e18`. Record terminal status from MCP before claiming delivery.

## Template (production starting point, not final art direction)

- 1080×1920 vertical Reels with text and the central subject **inside the effective safe area (roughly y=168–1330 px)**. Avoid copy in bottom caption/handle rail.
- A single persistent UI card with visible before/during/after interactions (button press, bar progress, product shape transformation, count or parameter feedback). The world persists while it changes; do not create one slide per phrase.
- Each temporary phrase gets **its own direct child** `<div id="capN" class="clip" data-start="x" data-duration="d">` with a stable inner `#phraseN`; animate the inner child rather than the timed `.clip` container.
- Consecutive phrase clips do not overlap. Keep max two short lines (in these tests ~94 px type, left x=96, y=975, width=840, supporting copy ~41–43 px y=1212). Check legibility per wording rather than reusing a size mechanically.
- A single paused GSAP scene timeline registered after tweens under the exact scene host ID. Local voice `<audio id=... class="clip">` on its own lane, with sparse audio cues as separate clips.
- Align phrase starts **to known time anchors**; do not divide narration into equal intervals. These V8 anchors were approximations from the earlier speech analysis, and will need final MP4/audio review.
- The initial visual must be meaningful at frame zero (thumbnail and Reels hook), even if the UI animates after that. Do not rely on a blank intro.

## Audio caveats

The V8 micro-SFX are **originally synthesized noise/foley prototypes**, not final sound-library recordings. Use real or well-designed foley before claiming premium quality. Generated narration is a temporary signed content URL in the test project; for future durable builds, package audio into `assets/voice.mp3` after acquiring it with the user's permission. Never treat an expiring signed URL as permanent project storage.

## Approval gates

1. `check --json` exits 0; 2. render job `completed` and MP4 saved; 3. phone-size visual inspection; 4. verify at least 8 SFX-to-action alignments in output with timestamps; 5. listen for intelligible voice and levels; 6. review cuts and compare reference frames; 7. record subjective approval separately from technical success.

**Remaining issue:** Connector 2 clips job failure output to 800 chars. Preserve/read full local `check` logs for any future failure; a return code by itself is not a diagnosis.

## Final render status — verified on 2026-11-10

All four V8 jobs reached `completed` and `progress: 100` with nonempty MP4 file sizes on the Connector 2 laptop. The media is **not** yet quality-approved.

| Version | Job ID | Length | MP4 bytes | Technical status |
|---|---|---:|---:|---|
| V8A — Não foi um estúdio | `3c408c3325181383437b643ea895f796` | 20 s | 2,096,634 | completed |
| V8B — Por que parou de rolar | `748732ad4c8c9dbb317e145c78916341` | 18 s | 1,996,305 | completed |
| V8C — Uma frase vira movimento | `783c7debc552f196f527a802d71cc3b3` | 20 s | 2,079,321 | completed |
| V8D — Desafio sem filmar nada | `6a2bfd75b9396d4283c7f934ff598e18` | 25 s | 2,219,827 | completed |

**Distinct evidence:** each job reached 40% (post-check render) and later 100% completed; HyperFrames validator exit code was therefore accepted by the installed worker. This does not prove subjective quality, perfect captions or word-level audio sync. Seven approximate phrase anchors and seven locally synthesized low-volume microcues were used per version. The user must supply MP4(s) from notebook Downloads for a real content review; the status API does not expose video bytes.
