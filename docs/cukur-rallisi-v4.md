# Çukur Rallisi — road season 03 / simulation v4

Release: `ugavole-2026-09-07.1`. Production: https://ugavole.com/oyunlar.

## Gameplay

- Each server seed creates 2–3 checkpoints sampled without repetition from six variants: paperwork, insurance, inspection, driver documents, breath test and seatbelt. Positions, traffic, wrong-way incidents and three fixed cameras vary by run. Opposing flashers still warn before controls.
- Documents expire by distance within the current tour. Ehliyet costs 120 points / 14 km, ruhsat-muayene 160 / 12 km, insurance 200 / 13 km. Required expired documents block the check. Purchases deduct from the tour score; any shortfall is covered by subsequent earnings in that same tour. Final score clamps to zero. Lifetime garage unlock points are never deducted.
- “amed abiyi tanıng?” is one fictional phone joker per tour. Calling releases the current checkpoint after 2.4 seconds, earns 75 points, and leaves document expiry unchanged. Regular checks earn 250 points. The breath/seatbelt variants also require their visible task unless the joker is used.
- Fixed cameras have a physical warning sign 1.2 km ahead and an on-screen warning approaching the camera. Crossing above 60 km/h deducts 180 points exactly once; 60 or below earns 75 points. All three reachable lanes are covered. No real fines, payments or phone calls.
- Clean dodges build a streak. Every third dodge gives a capped streak bonus. Collisions and speed tickets reset the streak. Results show best streak, renewal count and total tour expenses.

## Visual / mobile changes

The existing real-reference mountain image and official brand assets are reused; see v3 provenance. All roadside assets share the same world-distance projection as stationary obstacles. Billboard minimum-size clamps were removed; frames, steel legs, braces, concrete feet and contact shadows are attached to a single ground coordinate. Logos preserve their original aspect ratio. Scenery and roadside boards are depth-sorted together and fade gently into the distance. The pass has limestone banks, pines, olives, grasses and shrubs; the descent transitions to dry terrain and residential buildings.

Garage cards use native horizontal scrolling with scroll-snap, swipe, previous/next buttons and direct card indicators. Checkpoint touch buttons show their prices and required status. Mobile panels scroll within available space; landscape uses a wider overlay. Canvas effects include impact particles, shoulder dust, speed streaks and a single camera exposure, respecting reduced-motion for added motion effects. Sound effects cover phone, purchase and radar in addition to existing engine/brakes/traffic.

## Compatibility / persistence

`legacy-game`/`legacy-replay` preserve v2; `legacy-v3-game`/`legacy-v3-replay` preserve v3. Active old tabs can finish their own deterministic simulation. v4 uses a separate seed mixer, route generator and replay vocabulary; clients cannot supply an accepted final score. Migration `008_cukur_rallisi_encounters.sql` adds v4 start/finish RPCs with the same service-only security boundary and owner cookie. Finish locks the run and awards garage points once. The leaderboard includes v3 and v4 scores without deleting prior records.

## Verification

- 26 targeted engine, replay, route/security tests, including complete tours across 20 seeds and all four vehicles; six checkpoint variants across 80 seeds; exact radar threshold; document renewal/idempotence; one-use joker; a complete tour using the joker and incurring three tickets; frozen v3 replay.
- Production build and focused ESLint checks.
- Local browser: swipeable mobile garage; actual checkpoint component purchased all three documents (780 → 300 points), released the checkpoint, and released a different checkpoint with the phone joker. Renderer fixture checked official-logo billboards at near/far distances. These are local component fixtures, not proof of live gameplay.
- Production migration applied to ugavole-production; rollback-only database test confirmed v4 start, duplicate-finish idempotence and service-only access.
