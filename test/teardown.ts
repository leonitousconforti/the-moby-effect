import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as MobyApi from "the-moby-effect/Moby";
import * as TestHelpers from "./helpers.js";

export const teardown = async function (dindContainerId?: string | undefined, dindVolumeId?: string | undefined) {
    await Effect.gen(function* () {
        if (dindContainerId && dindVolumeId) {
            const testing_host: Option.Option<string> = yield* Config.string("THE_MOBY_EFFECT_TESTING_URL").pipe(
                Config.option
            );

            const intermediate_layer: MobyApi.MobyApi = Option.map(testing_host, MobyApi.fromUrl)
                .pipe(Option.getOrElse(() => MobyApi.fromPlatformDefault()))
                .pipe(Layer.orDie);

            yield* Effect.provide(TestHelpers.destroyDind(dindContainerId, dindVolumeId), intermediate_layer);
        } else {
            yield* Effect.die(
                new Error("You have a dind container id or a dind volume id but not both, something is wrong")
            );
        }
    }).pipe(Effect.runPromise);
};
