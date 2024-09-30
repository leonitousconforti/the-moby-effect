import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class RegistrySearchResponse extends Schema.Class<RegistrySearchResponse>("RegistrySearchResponse")(
    {
        star_count: MobySchemas.Int64,
        is_official: Schema.Boolean,
        name: Schema.String,
        is_automated: Schema.Boolean,
        description: Schema.String,
    },
    {
        identifier: "RegistrySearchResponse",
        title: "registry.SearchResult",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/registry/search.go#L23-L37",
    }
) {}
