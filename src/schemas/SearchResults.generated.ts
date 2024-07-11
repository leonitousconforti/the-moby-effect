import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SearchResults extends Schema.Class<SearchResults>("SearchResults")({
    Query: Schema.String,
    NumResults: MobySchemas.Int64,
    Results: Schema.Array(MobySchemas.SearchResult),
}) {}
