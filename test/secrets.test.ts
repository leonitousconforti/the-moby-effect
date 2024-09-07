import { afterAll, beforeAll, describe, expect, inject, it } from "@effect/vitest";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as Path from "@effect/platform/Path";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Secrets from "the-moby-effect/endpoints/Secrets";
import * as Swarm from "the-moby-effect/endpoints/Swarm";
import * as DindEngine from "the-moby-effect/engines/Dind";

const afterAllTimeout = Duration.seconds(10).pipe(Duration.toMillis);
const beforeAllTimeout = Duration.seconds(60).pipe(Duration.toMillis);

describe("MobyApi Secrets tests", () => {
    const makePlatformDindLayer = Function.pipe(
        Match.value(inject("__PLATFORM_VARIANT")),
        Match.when("bun", () => DindEngine.layerBun),
        Match.when("deno", () => DindEngine.layerDeno),
        Match.whenOr("node-18.x", "node-20.x", "node-22.x", () => DindEngine.layerNodeJS),
        Match.whenOr(
            "node-18.x-undici",
            "node-20.x-undici",
            "node-22.x-undici",
            "deno-undici",
            "bun-undici",
            () => DindEngine.layerUndici
        ),
        Match.exhaustive
    );

    const testDindLayer: DindEngine.DindLayer = makePlatformDindLayer({
        dindBaseImage: inject("__DOCKER_ENGINE_VERSION"),
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testServices = Layer.mergeAll(Path.layer, FileSystem.layer);
    const testRuntime = ManagedRuntime.make(Layer.provide(testDindLayer, testServices));

    beforeAll(async () => {
        await testRuntime.runPromise(Effect.void);
        await testRuntime.runPromise(Swarm.Swarm.init({ ListenAddr: "0.0.0.0:0" }));
    }, beforeAllTimeout);

    afterAll(async () => {
        try {
            await testRuntime.runPromise(Swarm.Swarm.leave({ force: true }));
        } finally {
            await testRuntime.dispose();
        }
    }, afterAllTimeout);

    it("Should see no secrets", async () => {
        const secrets = await testRuntime.runPromise(Secrets.Secrets.list());
        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(0);
    });

    it("Should create a secret", async () => {
        const secret = await testRuntime.runPromise(
            Secrets.Secrets.create({
                Name: "test-secret",
                Labels: { testLabel: "test" },
                Data: Buffer.from("aaahhhhh").toString("base64"),
            })
        );
        expect(secret.ID).toBeDefined();
    });

    it.skip("Should list and inspect the secret", async () => {
        const secrets = await testRuntime.runPromise(Secrets.Secrets.list());
        expect(secrets).toEqual([
            {
                ID: expect.any(String),
                Version: { Index: expect.any(Number) },
                CreatedAt: expect.any(String),
                UpdatedAt: expect.any(String),
                Spec: { Name: "test-secret", Labels: { testLabel: "test" } },
            },
        ]);

        const secret = await testRuntime.runPromise(Secrets.Secrets.inspect({ id: secrets[0]!.ID! }));
        expect(secret).toEqual(secrets[0]);
    });

    it("Should update the secret", async () => {
        const secrets = await testRuntime.runPromise(Secrets.Secrets.list());
        await testRuntime.runPromise(
            Secrets.Secrets.update({
                id: secrets[0]!.ID!,
                version: secrets[0]!.Version!.Index!,
                spec: { ...secrets[0]!.Spec, Labels: { testLabelUpdated: "test" } },
            })
        );
    });

    it.skip("Should list secrets with the new label", async () => {
        const secrets = await testRuntime.runPromise(
            Secrets.Secrets.list({ filters: JSON.stringify({ label: ["testLabelUpdated=test"] }) })
        );
        expect(secrets).toBeInstanceOf(Array);
        expect(secrets).toHaveLength(1);
    });

    it("Should delete the secret", async () => {
        const secrets = await testRuntime.runPromise(Secrets.Secrets.list());
        await testRuntime.runPromise(Secrets.Secrets.delete({ id: secrets[0]!.ID! }));
        const secretsAfterDelete = await testRuntime.runPromise(Secrets.Secrets.list());
        expect(secretsAfterDelete).toEqual([]);
    });
});
