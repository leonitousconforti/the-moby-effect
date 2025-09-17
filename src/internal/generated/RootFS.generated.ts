import * as Schema from "effect/Schema";

export class RootFS extends Schema.Class<RootFS>("RootFS")(
    {
        Type: Schema.optional(Schema.String),
        Layers: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "RootFS",
        title: "image.RootFS",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#RootFS",
    }
) {}
