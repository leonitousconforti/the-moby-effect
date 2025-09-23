import * as Schema from "effect/Schema";
import * as TypesComponentVersion from "./TypesComponentVersion.generated.js";

export class TypesVersion extends Schema.Class<TypesVersion>("TypesVersion")(
    {
        Platform: Schema.optional(
            Schema.Struct({
                Name: Schema.String,
            })
        ),
        Components: Schema.optionalWith(Schema.Array(Schema.NullOr(TypesComponentVersion.TypesComponentVersion)), {
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
        identifier: "TypesVersion",
        title: "types.Version",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#Version",
    }
) {}
