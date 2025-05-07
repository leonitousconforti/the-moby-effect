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
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L39-L44",
    }
) {}
