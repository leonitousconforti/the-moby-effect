import * as Schema from "effect/Schema";
import * as ComponentVersion from "./ComponentVersion.generated.js";

export class SystemVersionResponse extends Schema.Class<SystemVersionResponse>("SystemVersionResponse")(
    {
        Platform: Schema.optional(
            Schema.Struct({
                Name: Schema.String,
            })
        ),
        Components: Schema.optionalWith(Schema.Array(Schema.NullOr(ComponentVersion.ComponentVersion)), {
            nullable: true,
        }),
        Version: Schema.String,
        ApiVersion: Schema.String,
        MinAPIVersion: Schema.optional(Schema.String),
        GitCommit: Schema.String,
        GoVersion: Schema.String,
        Os: Schema.String,
        Arch: Schema.String,
        KernelVersion: Schema.optional(Schema.String),
        Experimental: Schema.optional(Schema.Boolean),
        BuildTime: Schema.optional(Schema.String),
    },
    {
        identifier: "SystemVersionResponse",
        title: "types.Version",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#Version",
    }
) {}
