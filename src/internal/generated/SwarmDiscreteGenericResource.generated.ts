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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DiscreteGenericResource",
    }
) {}
