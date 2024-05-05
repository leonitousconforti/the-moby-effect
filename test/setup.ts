import * as ciInfo from "ci-info";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as MobyApi from "the-moby-effect/Moby";
import type { GlobalSetupContext } from "vitest/node";
import * as TestHelpers from "./unit/helpers.js";

export default async function ({ provide }: GlobalSetupContext) {
    await Effect.gen(function* (_: Effect.Adapter) {
        /**
         * If we are anywhere but CI and we aren't running on linux we will
         * refuse to run the test suite because we might not be able to spawn a
         * dind container on windows or macos (depends on how the user has setup
         * their docker install) and I really don't like the idea of testing
         * against the users host docker install.
         */
        if (!ciInfo.isCI && process.platform !== "linux") {
            return yield* _(
                Effect.fail(
                    new Error(
                        "You are not running in a CI environment and you are not developing in a linux environment. This makes it very difficult to test as I cannot start a DIND container so I would have to run tests against your local docker install, which I am not going to do. Please let the tests run in a CI environment (open a pr and let the tests run there) or in a linux environment (reopen this repository in its devcontainer)."
                    )
                )
            );
        }

        const testing_host: Option.Option<string> = yield* _(
            Config.string("THE_MOBY_EFFECT_TESTING_URL").pipe(Config.option)
        );
        const dind_image: Option.Option<string> = yield* _(
            Config.string("THE_MOBY_EFFECT_DIND_IMAGE").pipe(Config.option)
        );

        /**
         * If we are in a CI environment and we have not provided a testing
         * host, we can just connect to the local runners docker host. We can't
         * spawn a dind container there because the platform of the runner is
         * not constrained in CI.
         */
        if (ciInfo.isCI && Option.isNone(testing_host)) {
            switch (process.platform) {
                case "linux":
                case "darwin": {
                    provide("__TEST_CONNECTION_OPTIONS", { connection: "socket", socketPath: "/var/run/docker.sock" });
                    return;
                }
                case "win32": {
                    provide("__TEST_CONNECTION_OPTIONS", {
                        connection: "socket",
                        socketPath: "//./pipe/docker_engine",
                    });
                    return;
                }
                default: {
                    return yield* _(Effect.fail(new Error("Unknown platform")));
                }
            }
        }

        /**
         * If we are in a development environment and we have not provided a
         * testing host, we can just connect to the local docker host and spawn
         * a dind container there (we already made sure we are on linux above)
         * but we will need to build the dind image first.
         */
        if (!ciInfo.isCI && Option.isNone(testing_host)) {
            const intermediate_layer = MobyApi.fromPlatformDefault();
            const [dindContainerId, dindVolumeId, dindConnectionOptions] = yield* _(
                Effect.provide(
                    TestHelpers.spawnDind({ kind: "socket", tag: "docker.io/library/docker:24-dind" }),
                    intermediate_layer
                )
            );
            provide("__DIND_VOLUME_ID", Option.some(dindVolumeId));
            provide("__TEST_CONNECTION_OPTIONS", dindConnectionOptions);
            provide("__DIND_CONTAINER_ID", Option.some(dindContainerId));
            return;
        }

        /**
         * If we are in a development environment or a CI environment and we
         * have provided a testing host and a dind image, we can connect to the
         * remote docker host and spawn a dind container there (we will assume
         * the remote host is a linux machine)
         */
        if (Option.isSome(testing_host) && Option.isSome(dind_image)) {
            const intermediate_layer = MobyApi.fromUrl(testing_host.value);
            const [dindContainerId, dindVolumeId, dindConnectionOptions] = yield* _(
                Effect.provide(TestHelpers.spawnDind({ kind: "http", tag: dind_image.value }), intermediate_layer)
            );
            provide("__DIND_VOLUME_ID", Option.some(dindVolumeId));
            provide("__TEST_CONNECTION_OPTIONS", dindConnectionOptions);
            provide("__DIND_CONTAINER_ID", Option.some(dindContainerId));
            return;
        }

        yield* _(
            Effect.fail(
                new Error(
                    "You are trying to run tests against a remote docker engine but you have not provided a testing host or a dind image. Please provide both."
                )
            )
        );
    })
        .pipe(Effect.scoped)
        .pipe(Effect.runPromise);
}
