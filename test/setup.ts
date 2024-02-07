import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

export default async function (_globalConfig: unknown, _projectConfig: unknown) {
    await Effect.gen(function* (_: Effect.Adapter) {
        // const docker_host: string = yield* _(Config.string("THE_MOBY_EFFECT_DOCKER_HOST"));
        const node_environment: string = yield* _(Config.string("NODE_ENV").pipe(Config.withDefault("development")));

        if (node_environment !== "ci") {
            yield* _(
                Effect.fail(
                    new Error(
                        "You are not running in a CI environment. I recommend you setup a dind container to test against rather than you local docker host"
                    )
                )
            );
        }
    }).pipe(Effect.runPromise);
}
