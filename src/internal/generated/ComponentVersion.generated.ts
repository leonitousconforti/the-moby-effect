import * as Schema from "effect/Schema";

export class ComponentVersion extends Schema.Class<ComponentVersion>("ComponentVersion")(
    {
        Name: Schema.String,
        Version: Schema.String,
        Details: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "ComponentVersion",
        title: "types.ComponentVersion",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L181-L186",
    }
) {}
