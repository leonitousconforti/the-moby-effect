import { Effect } from "effect";
import * as MobyApi from "./api.js";

declare global {
    let TEST_CONTAINER_ID: string;
}

const [HostsLocalMobyClient, MobyServiceLocal] = MobyApi.makeMobyLayer("hostsLocalMobyClient", {
    protocol: "unix",
    socketPath: "/var/run/docker.sock",
});

/**
 * Cleans up the container that will be created in the setup helper.
 */
const teardown = HostsLocalMobyClient.pipe(
    Effect.flatMap((service) => service.containerDelete(TEST_CONTAINER_ID, true))
).pipe(Effect.provide(MobyServiceLocal));

/**
 * This bootstraps the tests by using the generated api to start a docker-in-docker
 * container on the host so that we have something to test the generated api against
 * without needing to modify the host docker install.
 */
const setup = Effect.gen(function* (_: Effect.Adapter) {
    const localService: MobyApi.IMobyService = yield* _(HostsLocalMobyClient);

    const containerCreateResponse: Readonly<MobyApi.ContainerCreateResponse> = yield* _(
        localService.containerCreate({
            Image: "docker:dind-rootless",
            HostConfig: { Privileged: true },
        })
    );

    console.log(containerCreateResponse);

    // yield* _(localService.containerStart(containerCreateResponse.Id));

    // const isContainerHealthy = pipe(
    //     localService.containerInspect(containerCreateResponse.Id),
    //     Effect.map(({ State }) => State?.Health?.Status),
    //     Effect.tap((status) => Effect.log(`Waiting for container to report healthy status=${status}`)),
    //     Effect.flatMap((status) =>
    //         pipe(
    //             Match.value(status),
    //             Match.when(MobyApi.Health_StatusEnum.Healthy, (_s) => Effect.unit),
    //             Match.orElse((s) => Effect.fail(s))
    //         )
    //     )
    // );

    // yield* _(Effect.retryWhile(isContainerHealthy, (error) => error === MobyApi.Health_StatusEnum.Starting));
    // TEST_CONTAINER_ID = containerCreateResponse.Id;
}).pipe(Effect.provide(MobyServiceLocal));

/**
 * Moby api tests.
 */
describe("Api tests", () => {
    // beforeAll(async () => await Effect.runPromise(setup));
    afterAll(async () => await Effect.runPromise(teardown));

    it("Should fetch a list of containers", async () => {
        // const test: readonly MobyApi.ContainerSummary[] = await Effect.runPromise(
        //     HostsLocalMobyClient.pipe(Effect.flatMap((service) => service.containerList(true))).pipe(
        //         Effect.provide(MobyServiceLocal)
        //     )
        // );
        // expect(test).toBeInstanceOf(Array);
        // expect(test.length).toBeGreaterThan(0);
        await Effect.runPromise(setup);
    });
});
