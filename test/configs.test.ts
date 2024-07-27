import { afterAll, beforeAll, describe, expect, inject, it } from "@effect/vitest";

import * as Path from "@effect/platform/Path";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Configs from "the-moby-effect/endpoints/Configs";
import * as Swarm from "the-moby-effect/endpoints/Swarm";
import * as DindEngine from "the-moby-effect/engines/Dind";

describe("MobyApi Configs tests", () => {
    const makePlatformDindLayer = Function.pipe(
        Match.value(inject("__PLATFORM_VARIANT")),
        Match.when("bun", () => DindEngine.layerBun),
        Match.when("deno", () => DindEngine.layerDeno),
        Match.when("node", () => DindEngine.layerNodeJS),
        Match.whenOr("node-undici", "deno-undici", "bun-undici", () => DindEngine.layerUndici),
        Match.exhaustive
    );

    const testServices: DindEngine.DindLayer = makePlatformDindLayer({
        exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
        connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
    });

    const testRuntime = ManagedRuntime.make(Layer.provide(testServices, Path.layer));
    beforeAll(() => testRuntime.runPromise(Swarm.Swarm.init({ ListenAddr: "eth0" })).then(() => {}));
    afterAll(() => testRuntime.runPromise(Swarm.Swarm.leave({ force: true })).then(() => {}));
    afterAll(() => testRuntime.dispose().then(() => {}));

    it("Should see no configs", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list());
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(0);
    });

    it("Should create a config", async () => {
        const configCreateResponse = await testRuntime.runPromise(
            Configs.Configs.create({
                Name: "testConfig",
                Data: Buffer.from("aaahhhhh").toString("base64"),
                Labels: { testLabel: "test" },
            })
        );
        expect(configCreateResponse.ID).toBeDefined();
    });

    it("Should see one config", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list());
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);
    });

    it("Should update a config", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list());
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id = configs[0]!.ID;
        const configInspectResponse = await testRuntime.runPromise(Configs.Configs.inspect({ id }));
        expect(configInspectResponse).toBeDefined();
        expect(configInspectResponse.Spec).toBeDefined();
        expect(configInspectResponse.Spec?.Labels).toBeDefined();
        expect(configInspectResponse.Spec?.Labels?.["testLabel"]).toBe("test");

        await testRuntime.runPromise(
            Configs.Configs.update({
                id,
                version: configInspectResponse.Version!.Index!,
                spec: { ...configInspectResponse.Spec, Labels: { testLabel: "test2" } },
            })
        );
    });

    it("Should see no configs with label testLabel=test", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list({ filters: { label: ["testLabel=test"] } }));
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(0);
    });

    it("Should delete a config", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list());
        expect(configs).toBeInstanceOf(Array);
        expect(configs).toHaveLength(1);

        const id: string = configs[0]!.ID;
        await testRuntime.runPromise(Configs.Configs.delete({ id }));
    });

    it("Should see no configs", async () => {
        const configs = await testRuntime.runPromise(Configs.Configs.list());
        expect(configs).toHaveLength(0);
    });
});
