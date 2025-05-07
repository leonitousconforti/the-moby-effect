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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L107-L112",
    }
) {}
