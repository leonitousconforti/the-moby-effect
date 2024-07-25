import * as Schema from "@effect/schema/Schema";

export class SystemRuntimeWithStatus extends Schema.Class<SystemRuntimeWithStatus>("SystemRuntimeWithStatus")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.Object,
            }),
            { nullable: true }
        ),
        status: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "SystemRuntimeWithStatus",
        title: "system.RuntimeWithStatus",
    }
) {}
