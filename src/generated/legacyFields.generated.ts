import * as Schema from "@effect/schema/Schema";

export class legacyFields extends Schema.Class<legacyFields>("legacyFields")(
    {
        ExecutionDriver: Schema.optional(Schema.String),
    },
    {
        identifier: "legacyFields",
        title: "system.legacyFields",
    }
) {}
