import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerRestartPolicy extends Schema.Class<ContainerRestartPolicy>("ContainerRestartPolicy")(
    {
        Name: Schema.Literal("no", "always", "unless-stopped", "on-failure").annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/hostconfig.go#L281-L288",
        }),
        MaximumRetryCount: MobySchemas.Int64,
    },
    {
        identifier: "ContainerRestartPolicy",
        title: "container.RestartPolicy",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/hostconfig.go#L275-L279",
    }
) {}
