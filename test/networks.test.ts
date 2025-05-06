import { NodeContext } from "@effect/platform-node";
import { describe, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.concurrent.each(testMatrix)(
    "MobyApi Networks tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Networks tests", (it) => {
            it.effect("Should list all the networks", () =>
                Effect.gen(function* () {
                    const networks = yield* MobyEndpoints.Networks;
                    yield* networks.list();
                })
            );
        });
    }
);
