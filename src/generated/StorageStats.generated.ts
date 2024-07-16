import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class StorageStats extends Schema.Class<StorageStats>("StorageStats")(
    {
        read_count_normalized: Schema.optional(MobySchemas.UInt64),
        read_size_bytes: Schema.optional(MobySchemas.UInt64),
        write_count_normalized: Schema.optional(MobySchemas.UInt64),
        write_size_bytes: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "StorageStats",
        title: "types.StorageStats",
    }
) {}
