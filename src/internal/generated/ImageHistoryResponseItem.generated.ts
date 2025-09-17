import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImageHistoryResponseItem extends Schema.Class<ImageHistoryResponseItem>("ImageHistoryResponseItem")(
    {
        Comment: Schema.String,
        Created: MobySchemas.Int64,
        CreatedBy: Schema.String,
        Id: Schema.String,
        Size: MobySchemas.Int64,
        Tags: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ImageHistoryResponseItem",
        title: "image.HistoryResponseItem",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#HistoryResponseItem",
    }
) {}
