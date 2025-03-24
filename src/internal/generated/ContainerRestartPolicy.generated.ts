import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerRestartPolicy extends Schema.Class<ContainerRestartPolicy>("ContainerRestartPolicy")(
    {
        Name: Schema.Literal("no", "always", "unless-stopped", "on-failure"),
        MaximumRetryCount: MobySchemas.Int64,
    },
    {
        identifier: "ContainerRestartPolicy",
        title: "container.RestartPolicy",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L274-L278",
    }
) {}
