import { Function, Match } from "effect";

import { inject } from "@effect/vitest";
import { DindEngine } from "the-moby-effect";

export const makePlatformDindLayer = Function.pipe(
    Match.value(inject("__PLATFORM_VARIANT")),
    Match.when("bun", () => DindEngine.layerBun),
    Match.when("deno", () => DindEngine.layerDeno),
    Match.whenOr("node-22.x", "node-24.x", "node-26.x", () => DindEngine.layerNodeJS),
    Match.whenOr(
        "node-22.x-undici",
        "node-24.x-undici",
        "node-26.x-undici",
        "deno-undici",
        "bun-undici",
        () => DindEngine.layerUndici
    ),
    Match.orElseAbsurd
);
