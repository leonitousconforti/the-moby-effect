import * as Schema from "effect/Schema";

export class RegistrySearchResult extends Schema.Class<RegistrySearchResult>("RegistrySearchResult")(
    {
        star_count: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        is_official: Schema.Boolean,
        name: Schema.String,
        is_automated: Schema.Boolean,
        description: Schema.String,
    },
    {
        identifier: "RegistrySearchResult",
        title: "registry.SearchResult",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/registry#SearchResult",
    }
) {}
