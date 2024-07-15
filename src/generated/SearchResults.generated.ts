import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SearchResults extends Schema.Class<SearchResults>("SearchResults")(
    {
        query: Schema.NullOr(Schema.String),
        num_results: Schema.NullOr(MobySchemas.Int64),
        results: Schema.NullOr(Schema.Array(MobySchemasGenerated.SearchResult)),
    },
    {
        identifier: "SearchResults",
        title: "registry.SearchResults",
    }
) {}
