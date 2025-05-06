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

        // The following fields are deprecated, they relate to the
        // Engine component and are kept for backwards compatibility.

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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L46-L64",
    }
) {}
