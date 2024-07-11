import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class StorageStats extends Schema.Class<StorageStats>("StorageStats")({
    ReadCountNormalized: MobySchemas.UInt64,
    ReadSizeBytes: MobySchemas.UInt64,
    WriteCountNormalized: MobySchemas.UInt64,
    WriteSizeBytes: MobySchemas.UInt64,
}) {}
