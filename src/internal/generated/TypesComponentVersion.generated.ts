import * as Schema from "effect/Schema";

export class TypesComponentVersion extends Schema.Class<TypesComponentVersion>("TypesComponentVersion")(
    {
        Name: Schema.String,
        Version: Schema.String,
        Details: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "TypesComponentVersion",
        title: "types.ComponentVersion",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#ComponentVersion",
    }
) {}
