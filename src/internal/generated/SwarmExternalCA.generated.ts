import * as Schema from "effect/Schema";

export class SwarmExternalCA extends Schema.Class<SwarmExternalCA>("SwarmExternalCA")(
    {
        Protocol: Schema.Literal("cfssl").annotations({
            documentation:
                "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L129-L133",
        }),
        URL: Schema.String,
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        CACert: Schema.String,
    },
    {
        identifier: "SwarmExternalCA",
        title: "swarm.ExternalCA",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L135-L150",
    }
) {}
