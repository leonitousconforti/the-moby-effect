import * as Schema from "effect/Schema";

export class SystemRuntime extends Schema.Class<SystemRuntime>("SystemRuntime")(
    {
        path: Schema.optional(Schema.String),
        runtimeArgs: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        runtimeType: Schema.optional(Schema.String),
        options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.ObjectKeyword))),
    },
    {
        identifier: "SystemRuntime",
        title: "system.Runtime",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#Runtime",
    }
) {}
