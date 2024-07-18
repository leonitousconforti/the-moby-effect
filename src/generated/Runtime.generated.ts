import * as Schema from "@effect/schema/Schema";

export class Runtime extends Schema.Class<Runtime>("Runtime")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
    },
    {
        identifier: "Runtime",
        title: "types.Runtime",
    }
) {}