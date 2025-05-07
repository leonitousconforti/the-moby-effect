import * as Schema from "effect/Schema";

export class SwarmDriver extends Schema.Class<SwarmDriver>("SwarmDriver")(
    {
        Name: Schema.optional(Schema.String),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "SwarmDriver",
        title: "swarm.Driver",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/common.go#L31-L35",
    }
) {}
