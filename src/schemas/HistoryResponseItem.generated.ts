import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class HistoryResponseItem extends Schema.Class<HistoryResponseItem>("HistoryResponseItem")({
    Comment: Schema.String,
    Created: MobySchemas.Int64,
    CreatedBy: Schema.String,
    ID: Schema.String,
    Size: MobySchemas.Int64,
    Tags: Schema.Array(Schema.String),
}) {}
