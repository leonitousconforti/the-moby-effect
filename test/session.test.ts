import { NodeContext } from "@effect/platform-node";
import { describe, inject, layer } from "@effect/vitest";
import { Duration, Effect, Layer, Match } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

// FIXME: Sessions over Undici HTTP clients currently might not work due to inability to set required headers?
const skipForUndiciHttpClients = Match.value(inject("__PLATFORM_VARIANT")).pipe(
    Match.whenOr("node-20.x-undici", "node-22.x-undici", "node-24.x-undici", "deno-undici", "bun-undici", () => true),
    Match.orElse(() => false)
);

describe.skipIf(skipForUndiciHttpClients).each(testMatrix)(
    "MobyApi Sessions tests for $exposeDindContainerBy+$dindBaseImage",
    ({ dindBaseImage, exposeDindContainerBy }) => {
        const testLayer = MobyConnection.connectionOptionsFromPlatformSystemSocketDefault
            .pipe(
                Effect.map((connectionOptionsToHost) =>
                    makePlatformDindLayer({
                        dindBaseImage,
                        exposeDindContainerBy,
                        connectionOptionsToHost,
                    })
                )
            )
            .pipe(Layer.unwrapEffect)
            .pipe(Layer.provide(NodeContext.layer));

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Session tests", (it) => {
            it.scoped("Should be able to request a session", () =>
                Effect.gen(function* () {
                    const sessions = yield* MobyEndpoints.Sessions;
                    yield* sessions.session();
                })
            );
        });
    }
);
