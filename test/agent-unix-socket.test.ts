import { Effect } from "effect";

import * as MobyApi from "../src/main.js";

/** Connects to the local docker daemon on this host. */
const hostsLocalMobyClient: MobyApi.IMobyService = MobyApi.makeMobyClient({
    protocol: "unix",
    socketPath: "/var/run/docker.sock",
});

describe("MobyApi unix socket agent tests", () => {
    it("Local unix socket agent should see at least one container", async () => {
        const testData: readonly MobyApi.ContainerSummary[] = await hostsLocalMobyClient
            .containerList({ all: true })
            .pipe(Effect.scoped)
            .pipe(Effect.runPromise);

        expect(testData).toBeInstanceOf(Array);
        expect(testData.length).toBeGreaterThan(0);
    });
});
