// TS_NODE_PROJECT=./examples/tsconfig.examples.json node --no-warnings=ExperimentalWarning --loader ts-node/esm ./examples/list-all-containers.ts

import { Effect } from "effect";

import {
    IMobyService,
    ContainerSummary,
    containerListError,
    makeMobyLayer,
    MobyClientAlreadyInstantiated,
} from "../src/api.js";

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

// So, if you want more than one client at once, you can make a new tag and then make a layer for it.
const [MyRemoteMobyClient, MobyServiceRemote] = makeMobyLayer("remoteMobyClient", remoteConnectionOptions);

// You can't instantiate the same client tag twice, even if you give it the same options.
// Trying to do so will throw an error MobyClientAlreadyInstantiated!
// const [MyLocalMobyClient2, MobyServiceLocal2] = makeMobyLayer("localMobyClient2", localConnectionOptions);

// Then you can use the tag to get the client you want.
const main: Effect.Effect<
    never,
    containerListError | MobyClientAlreadyInstantiated,
    Readonly<[localContainers: readonly ContainerSummary[], remoteContainers: readonly ContainerSummary[]]>
> = Effect.gen(function* (_: Effect.Adapter) {
    const localDocker: IMobyService = yield* _(MyLocalMobyClient);
    const remoteDocker: IMobyService = yield* _(MyRemoteMobyClient);
    const data1: readonly ContainerSummary[] = yield* _(localDocker.containerList(true));
    const data2: readonly ContainerSummary[] = yield* _(remoteDocker.containerList(true));
    return [data1, data2] as const;
})
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.provide(MobyServiceRemote));

console.log(await Effect.runPromise(main));
