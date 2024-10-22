import * as Schema from "effect/Schema";

export class SystemRuntime extends Schema.Class<SystemRuntime>("SystemRuntime")(
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
    },
    {
        identifier: "SystemRuntime",
        title: "system.Runtime",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/runtime.go#L3-L14",
    }
) {}
