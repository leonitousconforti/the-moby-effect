import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Secrets from "the-moby-effect/endpoints/Secrets";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Secrets tests", (it) => {
    it.effect("Should see no secrets", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets.list();
            expect(secrets).toBeInstanceOf(Array);
            expect(secrets).toHaveLength(0);
        })
    );

    it.effect("Should create a secret", () =>
        Effect.gen(function* () {
            const secret = yield* Secrets.Secrets.create({
                Name: "test-secret",
                Labels: { testLabel: "test" },
                Data: Buffer.from("aaahhhhh").toString("base64"),
            });
            expect(secret.ID).toBeDefined();
        })
    );

    it.effect("Should list and inspect the secret", () =>
        Effect.gen(function* () {
            {
                const secrets = yield* Secrets.Secrets.list();
                expect(secrets).toEqual([
                    {
                        ID: expect.any(String),
                        Version: { Index: expect.any(Number) },
                        CreatedAt: expect.any(String),
                        UpdatedAt: expect.any(String),
                        Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
                    },
                ]);

                const secret = yield* Secrets.Secrets.inspect({ id: secrets[0]!.ID! });
                expect(secret).toEqual(secrets[0]);
            }
        })
    );

    it.effect("Should update the secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets.list();
            yield* Secrets.Secrets.update({
                id: secrets[0]!.ID!,
                version: secrets[0]!.Version!.Index!,
                spec: { ...secrets[0]!.Spec, Labels: { testLabelUpdated: "test" } },
            });
        })
    );

    it.effect("Should list secrets with the new label", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets.list({
                filters: JSON.stringify({ label: ["testLabelUpdated=test"] }),
            });
            expect(secrets).toBeInstanceOf(Array);
            expect(secrets).toHaveLength(1);
        })
    );

    it.effect("Should delete the secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets.list();
            yield* Secrets.Secrets.delete({ id: secrets[0]!.ID! });
            const secretsAfterDelete = yield* Secrets.Secrets.list();
            expect(secretsAfterDelete).toEqual([]);
        })
    );
});
