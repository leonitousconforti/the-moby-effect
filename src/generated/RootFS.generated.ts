import * as Schema from "effect/Schema";

export class RootFS extends Schema.Class<RootFS>("RootFS")(
    {
        Type: Schema.optional(Schema.String),
        Layers: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RootFS",
        title: "types.RootFS",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/types.go#L24-L28",
    }
) {}
