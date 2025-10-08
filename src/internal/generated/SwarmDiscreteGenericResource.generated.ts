import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmDiscreteGenericResource extends Schema.Class<SwarmDiscreteGenericResource>(
    "SwarmDiscreteGenericResource"
)(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(EffectSchemas.Number.I64),
    },
    {
        identifier: "SwarmDiscreteGenericResource",
        title: "swarm.DiscreteGenericResource",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#DiscreteGenericResource",
    }
) {}
