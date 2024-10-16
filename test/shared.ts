import { inject } from "@effect/vitest";

import * as FileSystem from "@effect/platform-node/NodeFileSystem";
import * as PlatformError from "@effect/platform/Error";
import * as Path from "@effect/platform/Path";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Context from "effect/Context";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";

import * as Containers from "the-moby-effect/endpoints/Containers";
import * as Images from "the-moby-effect/endpoints/Images";
import * as Swarms from "the-moby-effect/endpoints/Swarm";
import * as System from "the-moby-effect/endpoints/System";
import * as Volumes from "the-moby-effect/endpoints/Volumes";
import * as DindEngine from "the-moby-effect/engines/Dind";
import * as MobyEngine from "the-moby-effect/engines/Moby";

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

const testDindLayer = makePlatformDindLayer({
    dindBaseImage: inject("__DOCKER_ENGINE_VERSION"),
    exposeDindContainerBy: inject("__CONNECTION_VARIANT"),
    connectionOptionsToHost: inject("__DOCKER_HOST_CONNECTION_OPTIONS"),
});

const testServices = Layer.mergeAll(Path.layer, FileSystem.layer);

export const testLayer: Layer.Layer<
    Layer.Layer.Success<MobyEngine.MobyLayer>,
    | Containers.ContainersError
    | Images.ImagesError
    | System.SystemsError
    | Swarms.SwarmsError
    | Volumes.VolumesError
    | ParseResult.ParseError
    | PlatformError.PlatformError,
    never
> = Layer.tap(Layer.provide(testDindLayer, testServices), (context) => {
    const swarm = Context.get(context, Swarms.Swarm);
    return swarm.init({ ListenAddr: "0.0.0.0" });
});
