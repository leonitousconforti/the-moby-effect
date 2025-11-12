import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
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

        layer(testLayer, { timeout: Duration.minutes(2) })((it) => {
            describe.sequential("MobyApi Networks tests", () => {
                it.effect("Should see networks", () =>
                    Effect.gen(function* () {
                        const networks = yield* MobyEndpoints.Networks;
                        const networksListResponse = yield* networks.list();
                        expect(networksListResponse).toBeInstanceOf(Array);
                    })
                );

                it.effect("Should create a network", () =>
                    Effect.gen(function* () {
                        const networks = yield* MobyEndpoints.Networks;
                        const createResponse = yield* networks.create({
                            Name: "test-network-2",
                            Labels: { testLabel: "test" },
                        });
                        expect(createResponse.Id).toBeDefined();
                    })
                );

                it.effect("Should inspect a network", () =>
                    Effect.gen(function* () {
                        const networks = yield* MobyEndpoints.Networks;
                        const networksListResponse = yield* networks.list({ label: ["testLabel=test"] });
                        expect(networksListResponse).toBeInstanceOf(Array);
                        expect(networksListResponse).toHaveLength(1);
                        const id = networksListResponse[0]!.Id;
                        const inspectResponse = yield* networks.inspect(id);
                        expect(inspectResponse).toBeDefined();
                        expect(inspectResponse.Id).toBe(id);
                    })
                );

                it.effect("Should delete a network", () =>
                    Effect.gen(function* () {
                        const networks = yield* MobyEndpoints.Networks;
                        const networksListResponse = yield* networks.list({ label: ["testLabel=test"] });
                        expect(networksListResponse).toBeInstanceOf(Array);
                        expect(networksListResponse).toHaveLength(1);
                        const id = networksListResponse[0]!.Id;
                        yield* networks.delete(id);
                    })
                );

                it.effect("Should prune networks", () =>
                    Effect.gen(function* () {
                        const networks = yield* MobyEndpoints.Networks;
                        yield* networks.prune({ label: ["nonexistentLabel=1"] });
                    })
                );
            });
        });
    }
);
