import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class HistoryResponseItem extends Schema.Class<HistoryResponseItem>("HistoryResponseItem")(
    {
        Comment: Schema.NullOr(Schema.String),
        Created: Schema.NullOr(MobySchemas.Int64),
        CreatedBy: Schema.NullOr(Schema.String),
        Id: Schema.NullOr(Schema.String),
        Size: Schema.NullOr(MobySchemas.Int64),
        Tags: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "HistoryResponseItem",
        title: "image.HistoryResponseItem",
    }
) {}
