import { Effect } from "effect";

import { ContainerSummary, IMobyService, makeMobyLayer } from "../src/main.js";

// Connects to the local docker host via the unix socket
const [MyLocalMobyClient, MobyServiceLocal] = makeMobyLayer("localMobyClient");

// Then you can use the tag to get the client you want.
const allContainers: Readonly<ContainerSummary[]> = await Effect.gen(function* (_: Effect.Adapter) {
    const localDocker: IMobyService = yield* _(MyLocalMobyClient);
    const data: readonly ContainerSummary[] = yield* _(localDocker.containerList({ all: true }));
    return data;
})
    .pipe(Effect.scoped)
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.runPromise);

console.log(allContainers);
