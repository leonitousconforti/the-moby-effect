import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerThrottlingData extends Schema.Class<ContainerThrottlingData>("ContainerThrottlingData")(
    {
        /** Number of periods with throttling active */
        periods: MobySchemas.UInt64,

        /** Number of periods when the container hits its throttling limit. */
        throttled_periods: MobySchemas.UInt64,

        /** Aggregate time the container was throttled for in nanoseconds. */
        throttled_time: MobySchemas.UInt64,
    },
    {
        identifier: "ContainerThrottlingData",
        title: "container.ThrottlingData",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L5-L14",
    }
) {}
