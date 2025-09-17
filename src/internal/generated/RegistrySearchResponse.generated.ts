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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#SearchResult",
    }
) {}
