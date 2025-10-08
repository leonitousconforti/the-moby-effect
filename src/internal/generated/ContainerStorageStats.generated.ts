import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerStorageStats extends Schema.Class<ContainerStorageStats>("ContainerStorageStats")(
    {
        read_count_normalized: Schema.optional(EffectSchemas.Number.U64),
        read_size_bytes: Schema.optional(EffectSchemas.Number.U64),
        write_count_normalized: Schema.optional(EffectSchemas.Number.U64),
        write_size_bytes: Schema.optional(EffectSchemas.Number.U64),
    },
    {
        identifier: "ContainerStorageStats",
        title: "container.StorageStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#StorageStats",
    }
) {}
