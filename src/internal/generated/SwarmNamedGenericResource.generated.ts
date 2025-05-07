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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L121-L128",
    }
) {}
