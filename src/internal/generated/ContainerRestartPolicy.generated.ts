import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerRestartPolicy extends Schema.Class<ContainerRestartPolicy>("ContainerRestartPolicy")(
    {
        Name: Schema.Literal("no", "always", "on-failure", "unless-stopped"),
        MaximumRetryCount: MobySchemas.Int64,
    },
    {
        identifier: "ContainerRestartPolicy",
        title: "container.RestartPolicy",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#RestartPolicy",
    }
) {}
