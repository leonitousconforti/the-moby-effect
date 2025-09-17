import * as Schema from "effect/Schema";

export class ComponentVersion extends Schema.Class<ComponentVersion>("ComponentVersion")(
    {
        Name: Schema.String,
        Version: Schema.String,
        Details: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "ComponentVersion",
        title: "types.ComponentVersion",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#ComponentVersion",
    }
) {}
