import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SearchResults extends Schema.Class<SearchResults>("SearchResults")(
    {
        Query: Schema.String,
        NumResults: Schema.NullOr(MobySchemas.Int64),
        Results: Schema.Array(MobySchemasGenerated.SearchResult),
    },
    {
        identifier: "SearchResults",
        title: "registry.SearchResults",
    }
) {}
