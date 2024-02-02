import * as Effect from "effect/Effect";

import * as MobyApi from "../../src/index.js";

/** Connects to the local docker daemon on this host. */
const localDocker: MobyApi.MobyApi = MobyApi.fromConnectionOptions({
    connection: "socket",
    socketPath: "/var/run/docker.sock",
});

describe("MobyApi unix socket agent tests", () => {
    it("Local unix socket agent should be able to ping docker", async () => {
        const message: string = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                localDocker
            )
        );
        expect(message).toBe("OK");
    });
});
