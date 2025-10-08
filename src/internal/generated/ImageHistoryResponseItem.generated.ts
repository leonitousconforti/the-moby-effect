import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ImageHistoryResponseItem extends Schema.Class<ImageHistoryResponseItem>("ImageHistoryResponseItem")(
    {
        Comment: Schema.String,
        Created: EffectSchemas.Number.I64,
        CreatedBy: Schema.String,
        Id: Schema.String,
        Size: EffectSchemas.Number.I64,
        Tags: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ImageHistoryResponseItem",
        title: "image.HistoryResponseItem",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#HistoryResponseItem",
    }
) {}
