import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerThrottlingData extends Schema.Class<ContainerThrottlingData>("ContainerThrottlingData")(
    {
        periods: MobySchemas.UInt64,
        throttled_periods: MobySchemas.UInt64,
        throttled_time: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerThrottlingData",
        title: "container.ThrottlingData",
    }
) {}
