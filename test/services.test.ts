import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Services tests for $exposeDindContainerBy+$dindBaseImage",
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

        const withSwarmEnabled = Layer.tap(testLayer, (context) => {
            const swarm = Context.get(context, MobyEndpoints.Swarm);
            return swarm.init({ ListenAddr: "0.0.0.0" });
        });

        layer(withSwarmEnabled, { timeout: Duration.minutes(2) })("MobyApi Services tests", (it) => {
            it.effect("Should see no services", () =>
                Effect.gen(function* () {
                    const services = yield* MobyEndpoints.Services;
                    const servicesList = yield* services.list();
                    expect(servicesList).toBeInstanceOf(Array);
                    expect(servicesList).toHaveLength(0);
                })
            );
        });
    }
);
