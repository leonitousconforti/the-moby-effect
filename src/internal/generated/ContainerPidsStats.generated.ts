import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerPidsStats extends Schema.Class<ContainerPidsStats>("ContainerPidsStats")(
    {
        /** Current is the number of pids in the cgroup */
        current: Schema.optional(MobySchemas.UInt64),

        /** Limit is the hard limit on the number of pids in the cgroup. */
        limit: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "ContainerPidsStats",
        title: "container.PidsStats",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/container/stats.go#L141-L148",
    }
) {}
