import { afterAll, beforeAll, describe, inject, it } from "@effect/vitest";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as Path from "@effect/platform/Path";
import * as Duration from "effect/Duration";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as ManagedRuntime from "effect/ManagedRuntime";
import * as Match from "effect/Match";

import * as Networks from "the-moby-effect/endpoints/Networks";
import * as DindEngine from "the-moby-effect/engines/Dind";

const afterAllTimeout = Duration.seconds(10).pipe(Duration.toMillis);
const beforeAllTimeout = Duration.seconds(60).pipe(Duration.toMillis);

describe("MobyApi Networks tests", () => {
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
    beforeAll(() => testRuntime.runPromise(Effect.sync(Function.constUndefined)).then(() => {}), beforeAllTimeout);
    afterAll(() => testRuntime.dispose().then(() => {})), afterAllTimeout;

    it("Should list all the networks", async () => {
        await testRuntime.runPromise(Networks.Networks.list());
    });
});
