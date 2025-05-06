import * as Schema from "effect/Schema";

export class SystemRuntime extends Schema.Class<SystemRuntime>("SystemRuntime")(
    {
        // "Legacy" runtime configuration for runc-compatible runtimes.
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        // Shimv2 runtime configuration. Mutually exclusive with the legacy config above.
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), { nullable: true }),
    },
    {
        identifier: "SystemRuntime",
        title: "system.Runtime",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/runtime.go#L3-L14",
    }
) {}
