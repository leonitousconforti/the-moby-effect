# the-moby-effect

Moby/Docker API client built using [effect](effect.website). Docker uses the naming convention NounVerb for their endpoints and I am sticking with that here. If you want documentation, please consider reading [The Docker API documentation](https://docs.docker.com/engine/api/v1.43/), it is very well written and there is nothing in this library that wouldn't be in there (plus I would just do a worse job if I tried to write my interpretation of their documentation here). If you are just looking for some examples to get your feet underneath you quickly, then I do have some of those [here](./examples/).

## Features

- [x] - unix socket connections (tested with docker desktop)
- [x] - local http connections (tested with docker desktop)
- [ ] - ssh connections (very soon)
- [ ] - streaming (just like [dockerode](https://github.com/apocas/dockerode), streams are passed through directly to the caller)
- [ ] - tests

## Versioning

This package does not follow semantic versioning, instead the major and minor part represents the version the of docker api from the moby repository, can also be found [here](https://docs.docker.com/engine/api/version-history/). All bugfixes, breaking or otherwise, will be released under an incremented patch version.

## Example usage
```ts
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

## Effect Notes

Connection agents are scoped, but they are not scoped to the methods you would call from the service. This is because some endpoints return streams and if the connection agent is release on the closing of the service function scope, then the stream is broken when it gets to your effect.

## Contributing

Contributions are welcome! To test your changes run:

1. `pnpm install`
2. `pnpm build`
