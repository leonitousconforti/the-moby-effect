import { afterAll, beforeAll, describe, expect, inject, it } from "@effect/vitest";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as MobyApi from "the-moby-effect/Moby";

describe("MobyApi Secrets tests", () => {
    const testSecretsService: Layer.Layer<MobyApi.Secrets.Secrets, never, never> = MobyApi.fromConnectionOptions(
        inject("__TEST_CONNECTION_OPTIONS")
    ).pipe(Layer.orDie);
    const testSwarmsService: Layer.Layer<MobyApi.Swarm.Swarms, never, never> = MobyApi.fromConnectionOptions(
        inject("__TEST_CONNECTION_OPTIONS")
    ).pipe(Layer.orDie);

    beforeAll(async () => {
        await Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.init({ ListenAddr: "eth0" })),
            testSwarmsService
        ).pipe(Effect.runPromise);
    });

    afterAll(async () => {
        await Effect.provide(
            Effect.flatMap(MobyApi.Swarm.Swarms, (swarm) => swarm.leave({ force: true })),
            testSwarmsService
        ).pipe(Effect.runPromise);
    });

    it("Should see no secrets", async () => {
        const secrets: ReadonlyArray<MobyApi.Schemas.Secret> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) => secrets.list()),
                testSecretsService
            )
        );
        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(0);
    });

    it("Should create a secret", async () => {
        const secret: Readonly<MobyApi.Schemas.IDResponse> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) =>
                    secrets.create({
                        Name: "test-secret",
                        Labels: { testLabel: "test" },
                        Data: Buffer.from("aaahhhhh").toString("base64"),
                    })
                ),
                testSecretsService
            )
        );
        expect(secret.ID).toBeDefined();
    });

    it("Should list and inspect the secret", async () => {
        const secrets: ReadonlyArray<MobyApi.Schemas.Secret> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) => secrets.list()),
                testSecretsService
            )
        );
        expect(secrets).toEqual([
            {
                ID: expect.any(String),
                Version: { Index: expect.any(Number) },
                CreatedAt: expect.any(String),
                UpdatedAt: expect.any(String),
                Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
            },
        ]);

        const secret: Readonly<MobyApi.Schemas.Secret> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (_secrets) => _secrets.inspect({ id: secrets[0]!.ID! })),
                testSecretsService
            )
        );
        expect(secret).toEqual(secrets[0]);
    });

    it("Should update the secret", async () => {
        const secrets: ReadonlyArray<MobyApi.Schemas.Secret> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (_secrets) => _secrets.list()),
                testSecretsService
            )
        );

        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (_secrets) =>
                    _secrets.update({
                        id: secrets[0]!.ID!,
                        version: secrets[0]!.Version!.Index!,
                        spec: { ...secrets[0]!.Spec, Labels: { testLabelUpdated: "test" } },
                    })
                ),
                testSecretsService
            )
        );
    });

    it("Should list secrets with the new label", async () => {
        const secrets: ReadonlyArray<MobyApi.Schemas.Secret> = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) =>
                    secrets.list({ filters: JSON.stringify({ label: ["testLabelUpdated=test"] }) })
                ),
                testSecretsService
            )
        );
        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(1);
    });

    it("Should delete the secret", async () => {
        const secrets = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) => secrets.list()),
                testSecretsService
            )
        );
        await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (_secrets) => _secrets.delete({ id: secrets[0]!.ID! })),
                testSecretsService
            )
        );
        const secretsAfterDelete = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.Secrets.Secrets, (secrets) => secrets.list()),
                testSecretsService
            )
        );
        expect(secretsAfterDelete).toEqual([]);
    });
});
