import * as Schema from "effect/Schema";

export class SystemRuntime extends Schema.Class<SystemRuntime>("SystemRuntime")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), { nullable: true }),
    },
    {
        identifier: "SystemRuntime",
        title: "system.Runtime",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#Runtime",
    }
) {}
