import * as Schema from "@effect/schema/Schema";

export class RootFS extends Schema.Class<RootFS>("RootFS")(
    {
        Type: Schema.optional(Schema.String),
        Layers: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RootFS",
        title: "types.RootFS",
    }
) {}
