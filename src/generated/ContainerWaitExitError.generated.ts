import * as Schema from "@effect/schema/Schema";

export class ContainerWaitExitError extends Schema.Class<ContainerWaitExitError>("ContainerWaitExitError")(
    {
        Message: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerWaitExitError",
        title: "container.WaitExitError",
    }
) {}
