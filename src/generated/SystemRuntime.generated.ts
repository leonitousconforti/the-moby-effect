import * as Schema from "@effect/schema/Schema";

export class SystemRuntime extends Schema.Class<SystemRuntime>("SystemRuntime")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
    },
    {
        identifier: "SystemRuntime",
        title: "system.Runtime",
    }
) {}
