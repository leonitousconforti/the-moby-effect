import * as Schema from "effect/Schema";

export class RootFS extends Schema.Class<RootFS>("RootFS")(
    {
        Type: Schema.optional(Schema.String),
        Layers: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RootFS",
        title: "image.RootFS",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/image_inspect.go#L9-L13",
    }
) {}
