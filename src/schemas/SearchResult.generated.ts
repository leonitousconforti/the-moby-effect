import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SearchResult extends Schema.Class<SearchResult>("SearchResult")({
    StarCount: MobySchemas.Int64,
    IsOfficial: Schema.Boolean,
    Name: Schema.String,
    IsAutomated: Schema.Boolean,
    Description: Schema.String,
}) {}
