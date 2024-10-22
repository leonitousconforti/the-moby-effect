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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L107-L113",
    }
) {}
