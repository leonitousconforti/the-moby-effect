import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SystemVersionResponse extends Schema.Class<SystemVersionResponse>("SystemVersionResponse")(
    {
        Platform: Schema.optional(
            Schema.Struct({
                Name: Schema.String,
            })
        ),
        Components: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.ComponentVersion)), {
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
    }
) {}
