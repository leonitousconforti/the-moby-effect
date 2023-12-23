import { Effect, Layer } from "effect";

import * as MobyApi from "../src/index.js";

/** Connects to the local docker daemon on this host. */
const hostsLocalMobyClient: Layer.Layer<never, never, MobyApi.System.Systems> = MobyApi.System.fromConnectionOptions({
    connection: "unix",
    socketPath: "/var/run/docker.sock",
});

describe("MobyApi unix socket agent tests", () => {
    it("Local unix socket agent should be able to ping docker", async () => {
        const message: string = await Effect.runPromise(
            Effect.provide(
                Effect.flatMap(MobyApi.System.Systems, (systems) => systems.ping()),
                hostsLocalMobyClient
            )
        );
        expect(message).toBe("OK");
    });
});
