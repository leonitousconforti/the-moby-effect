import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as MobyApi from "../src/index.js";
import * as TestHelpers from "./unit/helpers.js";

export default async function (_globalConfig: unknown, _projectConfig: unknown) {
    await Effect.gen(function* (_: Effect.Adapter) {
        if (Option.isSome(globalThis.__DIND_CONTAINER_ID) && Option.isSome(globalThis.__DIND_VOLUME_ID)) {
            const testing_host: Option.Option<string> = yield* _(
                Config.string("THE_MOBY_EFFECT_TESTING_URL").pipe(Config.option)
            );

            const intermediate_layer: MobyApi.MobyApi = Option.map(testing_host, MobyApi.fromUrl)
                .pipe(Option.getOrElse(() => MobyApi.fromPlatformDefault()))
                .pipe(Layer.orDie);

            yield* _(
                Effect.provide(
                    TestHelpers.destroyDind(globalThis.__DIND_CONTAINER_ID.value, globalThis.__DIND_VOLUME_ID.value),
                    intermediate_layer
                )
            );
        } else if (Option.isSome(globalThis.__DIND_CONTAINER_ID) || Option.isSome(globalThis.__DIND_VOLUME_ID)) {
            yield* _(
                Effect.fail(
                    new Error("You have a dind container id or a dind volume id but not both, something is wrong.")
                )
            );
        }
    }).pipe(Effect.runPromise);
}
