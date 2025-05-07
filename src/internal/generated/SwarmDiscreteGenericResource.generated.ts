import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmDiscreteGenericResource extends Schema.Class<SwarmDiscreteGenericResource>(
    "SwarmDiscreteGenericResource"
)(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmDiscreteGenericResource",
        title: "swarm.DiscreteGenericResource",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L130-L137",
    }
) {}
