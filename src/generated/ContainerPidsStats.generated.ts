import * as Schema from "@effect/schema/Schema";
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
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L141-L148",
    }
) {}
