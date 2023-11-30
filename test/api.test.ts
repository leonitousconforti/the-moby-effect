import * as MobyApi from "./api.js";
import { Effect, Match, pipe } from "effect";

declare global {
    let TEST_CONTAINER_ID: string;
}

const DOCKER_TEST_CONNECTION_OPTIONS = {
    protocol: "unix",
    socketPath: "",
} as const;

/**
 * Cleans up the container that will be created in the setup helper.
 */
const teardown = MobyApi.containerDelete(DOCKER_TEST_CONNECTION_OPTIONS, TEST_CONTAINER_ID, true, true);

/**
 * This bootstraps the tests by using the generated api to start a docker-in-docker
 * container on the host so that we have something to test the generated api against
 * without needing to modify the host docker install.
 */
const setup = Effect.gen(function* (_: Effect.Adapter) {
    const containerCreateResponse: Readonly<MobyApi.ContainerCreateResponse> = yield* _(
        MobyApi.containerCreate(DOCKER_TEST_CONNECTION_OPTIONS, {
            Image: "docker:dind-rootless",
            HostConfig: { Privileged: true },
        })
    );

    yield* _(MobyApi.containerStart(DOCKER_TEST_CONNECTION_OPTIONS, containerCreateResponse.Id));

    const isContainerHealthy = pipe(
        MobyApi.containerInspect(DOCKER_TEST_CONNECTION_OPTIONS, containerCreateResponse.Id),
        Effect.map(({ State }) => State?.Health?.Status),
        Effect.tap((status) => Effect.log(`Waiting for container to report healthy status=${status}`)),
        Effect.flatMap((status) =>
            pipe(
                Match.value(status),
                Match.when(MobyApi.Health_StatusEnum.Healthy, (_s) => Effect.unit),
                Match.orElse((s) => Effect.fail(s))
            )
        )
    );

    yield* _(Effect.retryWhile(isContainerHealthy, (error) => error === MobyApi.Health_StatusEnum.Starting));
    TEST_CONTAINER_ID = containerCreateResponse.Id;
});

/**
 * Moby api tests.
 */
describe("Api tests", () => {
    beforeAll(async () => await Effect.runPromise(setup));
    afterAll(async () => await Effect.runPromise(teardown));

    it("Should fetch a list of containers", async () => {
        const test: readonly MobyApi.ContainerSummary[] = await Effect.runPromise(
            MobyApi.containerList(DOCKER_TEST_CONNECTION_OPTIONS, true)
        );
        expect(test).toBeInstanceOf(Array);
    });
});
