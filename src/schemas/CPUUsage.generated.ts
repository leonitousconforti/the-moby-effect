import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class CPUUsage extends Schema.Class<CPUUsage>("CPUUsage")({
    TotalUsage: MobySchemas.UInt64,
    PercpuUsage: Schema.Array(MobySchemas.UInt64),
    UsageInKernelmode: MobySchemas.UInt64,
    UsageInUsermode: MobySchemas.UInt64,
}) {}
