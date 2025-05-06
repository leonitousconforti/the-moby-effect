import { inject } from "@effect/vitest";
import { Function, Match } from "effect";
import { DindEngine } from "the-moby-effect";

export const makePlatformDindLayer = Function.pipe(
    Match.value(inject("__PLATFORM_VARIANT")),
    Match.when("bun", () => DindEngine.layerBun),
    Match.when("deno", () => DindEngine.layerDeno),
    Match.whenOr("node-18.x", "node-20.x", "node-22.x", () => DindEngine.layerNodeJS),
    Match.whenOr("node-20.x-undici", "node-22.x-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
    Match.orElse(() => DindEngine.layerNodeJS)
);
