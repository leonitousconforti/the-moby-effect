import * as Schema from "@effect/schema/Schema";

export class SystemRuntimeWithStatus extends Schema.Class<SystemRuntimeWithStatus>("SystemRuntimeWithStatus")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optional(Schema.Record(Schema.String, Schema.Object), { nullable: true }),
        status: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
    },
    {
        identifier: "SystemRuntimeWithStatus",
        title: "system.RuntimeWithStatus",
    }
) {}
