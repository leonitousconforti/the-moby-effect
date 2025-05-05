import type { TestProject } from "vitest/node";

import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

export const setup = async function ({ provide }: TestProject): Promise<void> {
    await Effect.gen(function* () {
        const platformVariant = yield* Config.literal(
            "deno",
            "bun",
            "node-18.x",
            "node-20.x",
            "node-22.x",
            "bun-undici",
            "deno-undici",
            "node-20.x-undici",
            "node-22.x-undici"
        )("__PLATFORM_VARIANT");

        provide("__PLATFORM_VARIANT", platformVariant);
    }).pipe(Effect.runPromise);
};
