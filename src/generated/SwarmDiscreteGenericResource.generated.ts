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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L130-L137",
    }
) {}
