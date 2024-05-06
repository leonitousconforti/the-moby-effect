import type { GlobalSetupContext } from "vitest/node";

import * as ciInfo from "ci-info";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";
import * as Tuple from "effect/Tuple";
import * as MobyApi from "the-moby-effect/Moby";
import * as TestHelpers from "./unit/helpers.js";

export const setup = async function ({
    provide,
}: GlobalSetupContext): Promise<
    [dindConnectionOptions: MobyApi.MobyConnectionOptions, dindContainerId: string, dindVolumeId: string] | undefined
> {
    return await Effect.gen(function* () {
        /**
         * If we are anywhere but CI and we aren't running on linux we will
         * refuse to run the test suite because we might not be able to spawn a
         * dind container on windows or macos (depends on how the user has setup
         * their docker install) and I really don't like the idea of testing
         * against the users host docker install.
         */
        if (!ciInfo.isCI && process.platform !== "linux") {
            return yield* Effect.die(
                new Error(
                    "You are not running in a CI environment and you are not developing in a linux environment. This makes it very difficult to test as I cannot start a DIND container so I would have to run tests against your local docker install, which I am not going to do. Please let the tests run in a CI environment (open a pr and let the tests run there) or in a linux environment (reopen this repository in its devcontainer)."
                )
            );
        }

        const connection_method: Option.Option<"socket" | "http" | "https" | "ssh"> = yield* Config.literal(
            "socket",
            "http",
            "https",
            "ssh"
        )("THE_MOBY_EFFECT_CONNECTION_METHOD").pipe(Config.option);
        const dind_image: Option.Option<string> = yield* Config.string("THE_MOBY_EFFECT_DIND_IMAGE").pipe(
            Config.option
        );

        /**
         * If we are in a CI environment and we have not provided a testing
         * host, we can just connect to the local runners docker host. We can't
         * spawn a dind container there because the platform of the runner is
         * not constrained in CI.
         */
        if (ciInfo.isCI && Option.isNone(connection_method)) {
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
                    return yield* Effect.fail(new Error("Unknown platform"));
                }
            }
        }

        /**
         * If we are in a development environment and we have not provided a
         * connection method, we can just connect to the local docker host and
         * spawn a dind container there (we already made sure we are on linux
         * above) but we will need to build the dind image first.
         *
         * Or If we are in a development environment or a CI environment and we
         * have provided a connection method and a dind image, we can connect to
         * the remote docker host and spawn a dind container there (we will
         * assume the remote host is a linux machine)
         */
        if (!ciInfo.isCI || (Option.isSome(connection_method) && Option.isSome(dind_image))) {
            const intermediate_layer = MobyApi.fromPlatformDefault();
            const [dindContainerId, dindVolumeId, dindConnectionOptions] = yield* Effect.provide(
                TestHelpers.spawnDind({
                    kind: Option.getOrElse(connection_method, () => "socket"),
                    tag: Option.getOrElse(dind_image, () => "docker.io/library/docker:26-dind"),
                }),
                intermediate_layer
            );
            provide("__TEST_CONNECTION_OPTIONS", dindConnectionOptions);
            return Tuple.make(dindConnectionOptions, dindContainerId, dindVolumeId);
        }

        // If we reach this point, we have not provided a testing host or a dind image
        yield* Effect.die(
            new Error(
                "You are trying to run tests against a remote docker engine but you have not provided a testing host or a dind image. Please provide both."
            )
        );
    })
        .pipe(Effect.scoped)
        .pipe(Effect.runPromise);
};
