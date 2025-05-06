import { NodeContext } from "@effect/platform-node";
import { describe, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.concurrent.each(testMatrix)(
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
