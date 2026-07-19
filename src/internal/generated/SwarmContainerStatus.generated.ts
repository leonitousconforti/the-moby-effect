import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";

export class SwarmContainerStatus extends Schema.Class<SwarmContainerStatus>("SwarmContainerStatus")(
    {
        ContainerID: MobyIdentifiers.ContainerIdentifier,
        PID: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        ExitCode: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "SwarmContainerStatus",
        title: "swarm.ContainerStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ContainerStatus",
    }
) {}
