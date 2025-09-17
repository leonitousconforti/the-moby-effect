import * as Schema from "effect/Schema";

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>("ContainerWaitExitError")(
    {
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerWaitExitError",
        title: "container.WaitExitError",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#WaitExitError",
    }
) {}
