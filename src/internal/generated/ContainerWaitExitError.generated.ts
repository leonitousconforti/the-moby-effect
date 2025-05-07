import * as Schema from "effect/Schema";

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>("ContainerWaitExitError")(
    {
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerWaitExitError",
        title: "container.WaitExitError",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/wait_exit_error.go#L6-L12",
    }
) {}
