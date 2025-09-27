import { NodeContext } from "@effect/platform-node";
import { describe, expect, layer } from "@effect/vitest";
import { Duration, Effect, Layer } from "effect";
import { MobyConnection, MobyEndpoints } from "the-moby-effect";
import { makePlatformDindLayer } from "./shared-file.js";
import { testMatrix } from "./shared-global.js";

describe.each(testMatrix)(
    "MobyApi Secrets tests for $exposeDindContainerBy+$dindBaseImage",
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

        layer(testLayer, { timeout: Duration.minutes(2) })("MobyApi Secrets tests", (it) => {
            it.effect("Should see no secrets", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secretsList = yield* secrets.list();
                    expect(secretsList).toBeInstanceOf(Array);
                    expect(secretsList).toHaveLength(0);
                })
            );

            it.effect("Should create a secret", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secret = yield* secrets.create({
                        Name: "test-secret",
                        Labels: { testLabel: "test" },
                        Data: Buffer.from("aaahhhhh"),
                    });
                    expect(secret.Id).toBeDefined();
                })
            );

            it.effect("Should list and inspect the secret", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secretsList = yield* secrets.list();
                    expect(secretsList).toEqual([
                        {
                            ID: expect.any(String),
                            Version: { Index: expect.any(Number) },
                            CreatedAt: expect.any(Date),
                            UpdatedAt: expect.any(Date),
                            Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
                        },
                    ]);

                    const secret = yield* secrets.inspect(secretsList[0]!.ID);
                    expect(secret).toEqual(secretsList[0]);
                })
            );

            it.effect("Should update the secret", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secretsList = yield* secrets.list();
                    yield* secrets.update(secretsList[0]!.ID, secretsList[0]!.Version!.Index!, {
                        ...secretsList[0]!.Spec,
                        Labels: { testLabelUpdated: "test" },
                    });
                })
            );

            it.effect("Should list secrets with the new label", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secretsList = yield* secrets.list({ label: ["testLabelUpdated=test"] });
                    expect(secretsList).toBeInstanceOf(Array);
                    expect(secretsList).toHaveLength(1);
                })
            );

            it.effect("Should delete the secret", () =>
                Effect.gen(function* () {
                    const secrets = yield* MobyEndpoints.Secrets;
                    const secretsList = yield* secrets.list();
                    yield* secrets.delete(secretsList[0]!.ID);
                    const secretsAfterDelete = yield* secrets.list();
                    expect(secretsAfterDelete).toEqual([]);
                })
            );
        });
    }
);
