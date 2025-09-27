import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Tasks tests for $exposeDindContainerBy+$dindBaseImage",
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
            return swarm.init();
        });

        layer(withSwarmEnabled, { timeout: Duration.minutes(2) })("MobyApi Tasks tests", (it) => {
            it.effect("Should see no tasks", () =>
                Effect.gen(function* () {
                    const tasks = yield* MobyEndpoints.Tasks;
                    const tasksList = yield* tasks.list();
                    expect(tasksList).toBeInstanceOf(Array);
                    expect(tasksList).toHaveLength(0);
                })
            );
        });
    }
);
