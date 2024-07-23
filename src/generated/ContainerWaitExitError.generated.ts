import * as Schema from "@effect/schema/Schema";

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>("ContainerWaitExitError")(
    {
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerWaitExitError",
        title: "container.WaitExitError",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/wait_exit_error.go#L6-L12",
    }
) {}
