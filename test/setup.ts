import * as Config from "effect/Config";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";

export default async function (_globalConfig: unknown, _projectConfig: unknown) {
    await Effect.gen(function* (_: Effect.Adapter) {
        const node_environment: string = yield* _(Config.string("NODE_ENV"));
        const docker_host: string = yield* _(Config.string("THE_MOBY_EFFECT_DOCKER_HOST"));

        if (node_environment !== "ci") {
            yield* _(
                Console.warn(
                    "You are not running in a CI environment. I recommend you setup a dind container to test against rather than you local docker host"
                )
            );
        }
    }).pipe(Effect.runPromise);
}
