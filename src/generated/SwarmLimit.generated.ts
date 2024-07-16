import * as Schema from "@effect/schema/Schema";
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
    }
) {}
