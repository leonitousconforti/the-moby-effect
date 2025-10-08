import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmContainerStatus extends Schema.Class<SwarmContainerStatus>("SwarmContainerStatus")(
    {
        ContainerID: Schema.String,
        PID: EffectSchemas.Number.I64,
        ExitCode: EffectSchemas.Number.I64,
    },
    {
        identifier: "SwarmContainerStatus",
        title: "swarm.ContainerStatus",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ContainerStatus",
    }
) {}
