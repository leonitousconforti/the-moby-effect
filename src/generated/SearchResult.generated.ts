import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SearchResult extends Schema.Class<SearchResult>("SearchResult")(
    {
        StarCount: Schema.NullOr(MobySchemas.Int64),
        IsOfficial: Schema.NullOr(Schema.Boolean),
        Name: Schema.String,
        IsAutomated: Schema.NullOr(Schema.Boolean),
        Description: Schema.String,
    },
    {
        identifier: "SearchResult",
        title: "registry.SearchResult",
    }
) {}
