---
"the-moby-effect": patch
---

Clear the remaining type-aware Effect lint reports: endpoint query and filter schemas now use `Schema.Finite`/`Schema.FiniteFromString` so `NaN` and `Infinity` are rejected, an `Effect.sync` returning a constant became `Effect.succeed`, an ssh dispatcher release that awaited nothing became `Effect.sync`, and the deliberate patterns (Promise/callback adapters, wall-clock reads in tests, Node agent type imports, the dind channel coercion, console output in the callback examples) carry scoped disables explaining why.
