import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Context, Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Swarm tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(withSwarmEnabled, { timeout: Duration.minutes(2) })("MobyApi Swarm tests", (it) => {
            it.effect("Should leave, rejoin, unlock, update, and get the unlock key of the swarm", () =>
                Effect.gen(function* () {
                    const swarm = yield* MobyEndpoints.Swarm;
                    const inspect = yield* swarm.inspect();

                    const spec = inspect.Spec;
                    const version = inspect.Version;
                    expect(inspect).toBeDefined();
                    expect(spec).toBeDefined();
                    expect(version).toBeDefined();
                    expect(version!.Index).toBeDefined();

                    yield* swarm.update(spec!, version!.Index!, {
                        rotateWorkerToken: true,
                        rotateManagerToken: true,
                        rotateManagerUnlockKey: true,
                    });

                    const { UnlockKey } = yield* swarm.unlockkey();
                    expect(UnlockKey).toBeDefined();
                })
            );
        });
    }
);
