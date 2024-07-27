import * as Schema from "@effect/schema/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/types.go#L188-L206",
    }
) {}
