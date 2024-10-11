import { expect, layer } from "@effect/vitest";
import { Effect, Layer } from "effect";
import * as Secrets from "the-moby-effect/endpoints/Secrets";
import { testLayer } from "./shared.js";

layer(Layer.fresh(testLayer))("MobyApi Secrets tests", (it) => {
    it.effect("Should see no secrets", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secretsList = yield* secrets.list();
            expect(secretsList).toBeInstanceOf(Array);
            expect(secretsList).toHaveLength(0);
        })
    );

    it.effect("Should create a secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secret = yield* secrets.create({
                Name: "test-secret",
                Labels: { testLabel: "test" },
                Data: Buffer.from("aaahhhhh").toString("base64"),
            });
            expect(secret.ID).toBeDefined();
        })
    );

    it.effect("Should list and inspect the secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secretsList = yield* secrets.list();
            expect(secrets).toEqual([
                {
                    ID: expect.any(String),
                    Version: { Index: expect.any(Number) },
                    CreatedAt: expect.any(String),
                    UpdatedAt: expect.any(String),
                    Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
                },
            ]);

            const secret = yield* secrets.inspect({ id: secretsList[0]!.ID! });
            expect(secret).toEqual(secretsList[0]);
        })
    );

    it.effect("Should update the secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secretsList = yield* secrets.list();
            yield* secrets.update({
                id: secretsList[0]!.ID!,
                version: secretsList[0]!.Version!.Index!,
                spec: { ...secretsList[0]!.Spec, Labels: { testLabelUpdated: "test" } },
            });
        })
    );

    it.effect("Should list secrets with the new label", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secretsList = yield* secrets.list({
                filters: JSON.stringify({ label: ["testLabelUpdated=test"] }),
            });
            expect(secretsList).toBeInstanceOf(Array);
            expect(secretsList).toHaveLength(1);
        })
    );

    it.effect("Should delete the secret", () =>
        Effect.gen(function* () {
            const secrets = yield* Secrets.Secrets;
            const secretsList = yield* secrets.list();
            yield* secrets.delete({ id: secretsList[0]!.ID! });
            const secretsAfterDelete = yield* secrets.list();
            expect(secretsAfterDelete).toEqual([]);
        })
    );
});
