import * as Schema from "effect/Schema";
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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/registry/search.go#L24-L38",
    }
) {}
