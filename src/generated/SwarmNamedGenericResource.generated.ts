import * as Schema from "@effect/schema/Schema";

export class SwarmNamedGenericResource extends Schema.Class<SwarmNamedGenericResource>("SwarmNamedGenericResource")(
    {
        Kind: Schema.optional(Schema.String),
        Value: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNamedGenericResource",
        title: "swarm.NamedGenericResource",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L121-L128",
    }
) {}
