import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class CPUUsage extends Schema.Class<CPUUsage>("CPUUsage")(
    {
        total_usage: Schema.NullOr(MobySchemas.UInt64),
        percpu_usage: Schema.optional(Schema.Array(MobySchemas.UInt64), { nullable: true }),
        usage_in_kernelmode: Schema.NullOr(MobySchemas.UInt64),
        usage_in_usermode: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "CPUUsage",
        title: "types.CPUUsage",
    }
) {}
