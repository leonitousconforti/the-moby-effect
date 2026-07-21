import * as Schema from "effect/Schema";

export class SwarmNamedGenericResource extends Schema.Class<SwarmNamedGenericResource>("SwarmNamedGenericResource")(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNamedGenericResource",
        title: "swarm.NamedGenericResource",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NamedGenericResource",
    }
) {}
