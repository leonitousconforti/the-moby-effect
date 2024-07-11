import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class BlkioStats extends Schema.Class<BlkioStats>("BlkioStats")({
    IoServiceBytesRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoServicedRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoQueuedRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoServiceTimeRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoWaitTimeRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoMergedRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    IoTimeRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
    SectorsRecursive: Schema.Array(MobySchemas.BlkioStatEntry),
}) {}
