import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class CPUStats extends Schema.Class<CPUStats>("CPUStats")({
    CPUUsage: MobySchemas.CPUUsage,
    SystemUsage: MobySchemas.UInt64,
    OnlineCPUs: MobySchemas.UInt32,
    ThrottlingData: MobySchemas.ThrottlingData,
}) {}
