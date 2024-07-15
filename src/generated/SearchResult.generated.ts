import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SearchResult extends Schema.Class<SearchResult>("SearchResult")(
    {
        star_count: Schema.NullOr(MobySchemas.Int64),
        is_official: Schema.NullOr(Schema.Boolean),
        name: Schema.NullOr(Schema.String),
        is_automated: Schema.NullOr(Schema.Boolean),
        description: Schema.NullOr(Schema.String),
    },
    {
        identifier: "SearchResult",
        title: "registry.SearchResult",
    }
) {}
