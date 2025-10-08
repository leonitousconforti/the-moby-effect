import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerMemoryStats extends Schema.Class<ContainerMemoryStats>("ContainerMemoryStats")(
    {
        usage: Schema.optional(EffectSchemas.Number.U64),
        max_usage: Schema.optional(EffectSchemas.Number.U64),
        stats: Schema.optionalWith(Schema.Record({ key: Schema.String, value: EffectSchemas.Number.U64 }), {
            nullable: true,
        }),
        failcnt: Schema.optional(EffectSchemas.Number.U64),
        limit: Schema.optional(EffectSchemas.Number.U64),
        commitbytes: Schema.optional(EffectSchemas.Number.U64),
        commitpeakbytes: Schema.optional(EffectSchemas.Number.U64),
        privateworkingset: Schema.optional(EffectSchemas.Number.U64),
    },
    {
        identifier: "ContainerMemoryStats",
        title: "container.MemoryStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#MemoryStats",
    }
) {}
