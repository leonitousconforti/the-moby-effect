import * as Schema from "@effect/schema/Schema";

export class WaitExitError extends Schema.Class<WaitExitError>("WaitExitError")(
    {
        Message: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "WaitExitError",
        title: "container.WaitExitError",
    }
) {}
