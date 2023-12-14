import { Console, Effect, Scope } from "effect";

import { ContainerSummary, IMobyService, MobyError, makeMobyClient } from "../src/main.js";

// Passing in no connection options means it will connect to the local docker socket
const localDocker: IMobyService = makeMobyClient();

const main: Effect.Effect<Scope.Scope, MobyError, Readonly<ContainerSummary[]>> = Effect.gen(function* (
    _: Effect.Adapter
) {
    const data: readonly ContainerSummary[] = yield* _(localDocker.containerList({ all: true }));
    yield* _(Console.log(data));
    return data;
});

await Effect.scoped(main).pipe(Effect.runPromise);
