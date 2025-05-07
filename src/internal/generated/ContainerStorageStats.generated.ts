import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerStorageStats extends Schema.Class<ContainerStorageStats>("ContainerStorageStats")(
    {
        read_count_normalized: Schema.optional(MobySchemas.UInt64),
        read_size_bytes: Schema.optional(MobySchemas.UInt64),
        write_count_normalized: Schema.optional(MobySchemas.UInt64),
        write_size_bytes: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "ContainerStorageStats",
        title: "container.StorageStats",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L107-L113",
    }
) {}
