import { Effect, ReadonlyArray } from "effect";

import {
    ContainerSummary,
    IMobyService,
    MobyClientAlreadyInstantiated,
    containerListError,
    makeMobyLayer,
} from "../src/main.js";

const localConnectionOptions = {
    protocol: "unix",
    socketPath: "/var/run/docker.sock",
} as const;

const remoteConnectionOptions = {
    protocol: "ssh",
    host: "remote-machine.local",
    port: 22,
} as const;

// Connects to the local docker host via the unix socket
const [MyLocalMobyClient, MobyServiceLocal] = makeMobyLayer("localMobyClient", localConnectionOptions);
console.log(`Connected to local docker daemon @ ${localConnectionOptions.socketPath}`);

// So, if you want more than one client at once, you can make a new tag and then make a layer for it.
const [MyRemoteMobyClient, MobyServiceRemote] = makeMobyLayer("remoteMobyClient", remoteConnectionOptions);
console.log(`Connected to remote docker daemon @ ${remoteConnectionOptions.host}:${remoteConnectionOptions.port}`);

// You can't instantiate the same client tag twice, even if you give it the same options.
// Trying to do so will throw an error MobyClientAlreadyInstantiated!
// const [MyLocalMobyClient2, MobyServiceLocal2] = makeMobyLayer("localMobyClient", localConnectionOptions);

// However, you can instantiate as many client as you want with the
// same options, as long as you give them different tags.
// const [MyLocalMobyClient2, MobyServiceLocal2] = makeMobyLayer("anotherLocalMobyClient", localConnectionOptions);

// Then you can use the tag to get the client you want.
const main: Effect.Effect<
    never,
    containerListError | MobyClientAlreadyInstantiated,
    Readonly<ContainerSummary[]>
> = Effect.gen(function* (_: Effect.Adapter) {
    const localDocker: IMobyService = yield* _(MyLocalMobyClient);
    const remoteDocker: IMobyService = yield* _(MyRemoteMobyClient);
    const data1: readonly ContainerSummary[] = yield* _(localDocker.containerList({ all: true }));
    const data2: readonly ContainerSummary[] = yield* _(remoteDocker.containerList({ all: true }));
    return [data1, data2] as const;
})
    .pipe(Effect.scoped)
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.provide(MobyServiceRemote))
    .pipe(Effect.map(ReadonlyArray.flatten));

const allContainers = await Effect.runPromise(main);
console.log(allContainers);
