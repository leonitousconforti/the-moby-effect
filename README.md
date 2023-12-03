# the-moby-effect

Docker API client automatically generated from the moby repository using swagger-codegen and effect-ts

## Features

- [x] - unix socket connections (tested with docker desktop)
- [x] - local http connections (tested with docker desktop)
- [ ] - ssh connections (very soon)

## Versioning

This package does not follow semantic versioning, instead the major and minor part represents the version the of docker api from the moby repository, can also be found [here](https://docs.docker.com/engine/api/version-history/). All bugfixes in the codegen, breaking or otherwise, will be released under an incremented patch version.

## Example usage
```ts
import { Effect, ReadonlyArray } from "effect";

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
    Readonly<ContainerSummary[]>
> = Effect.gen(function* (_: Effect.Adapter) {
    const localDocker: IMobyService = yield* _(MyLocalMobyClient);
    const remoteDocker: IMobyService = yield* _(MyRemoteMobyClient);
    const data1: readonly ContainerSummary[] = yield* _(localDocker.containerList(true));
    const data2: readonly ContainerSummary[] = yield* _(remoteDocker.containerList(true));
    return [data1, data2] as const;
})
    .pipe(Effect.provide(MobyServiceLocal))
    .pipe(Effect.provide(MobyServiceRemote))
    .pipe(Effect.map(ReadonlyArray.flatten));

// [
//     {
//         Id: "076e8836e221d40411064eaa6aab0c5b3d2e333873d5f39b1530e9712e1265ba",
//         Names: ["/intelligent_dhawan"],
//         Image: "hello-world",
//         ImageID: "sha256:9c7a54a9a43cca047013b82af109fe963fde787f63f9e016fdc3384500c2823d",
//         Command: "/hello",
//         Created: 1701200316,
//         Ports: [],
//         Labels: {},
//         State: "exited",
//         Status: "Exited (0) 8 hours ago",
//         HostConfig: { NetworkMode: "default" },
//         NetworkSettings: { Networks: [Object] },
//         Mounts: [],
//     },
// ],
// []
const allContainers = await Effect.runPromise(main);
console.log(allContainers);
```
