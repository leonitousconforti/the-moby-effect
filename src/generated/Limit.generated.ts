import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Limit extends Schema.Class<Limit>("Limit")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64, { nullable: true }),
        MemoryBytes: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Pids: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "Limit",
        title: "swarm.Limit",
    }
) {}
