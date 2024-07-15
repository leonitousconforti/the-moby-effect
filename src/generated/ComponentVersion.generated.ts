import * as Schema from "@effect/schema/Schema";

export class ComponentVersion extends Schema.Class<ComponentVersion>("ComponentVersion")(
    {
        Name: Schema.NullOr(Schema.String),
        Version: Schema.NullOr(Schema.String),
        Details: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "ComponentVersion",
        title: "types.ComponentVersion",
    }
) {}
