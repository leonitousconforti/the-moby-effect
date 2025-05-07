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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/image_history.go#L9-L36",
    }
) {}
