import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.js";

export class SwarmResources extends Schema.Class<SwarmResources>("SwarmResources")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64),
        MemoryBytes: Schema.optional(MobySchemas.Int64),
        GenericResources: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmResources",
        title: "swarm.Resources",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L99-L105",
    }
) {}
