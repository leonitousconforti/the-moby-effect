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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Limit",
    }
) {}
