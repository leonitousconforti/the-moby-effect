import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmLimit extends Schema.Class<SwarmLimit>("SwarmLimit")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64),
        MemoryBytes: Schema.optional(MobySchemas.Int64),
        Pids: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmLimit",
        title: "swarm.Limit",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L107-L112",
    }
) {}
