import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class CPUStats extends Schema.Class<CPUStats>("CPUStats")(
    {
        cpu_usage: MobySchemasGenerated.CPUUsage,
        system_cpu_usage: Schema.optional(MobySchemas.UInt64),
        online_cpus: Schema.optional(MobySchemas.UInt32),
        throttling_data: Schema.optional(MobySchemasGenerated.ThrottlingData),
    },
    {
        identifier: "CPUStats",
        title: "types.CPUStats",
    }
) {}
