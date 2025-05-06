import * as Schema from "effect/Schema";

export class SwarmSeccompOpts extends Schema.Class<SwarmSeccompOpts>("SwarmSeccompOpts")(
    {
        Mode: Schema.optional(
            Schema.Literal("default", "unconfined", "custom").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L34-L42",
            })
        ),
        Profile: Schema.optionalWith(Schema.Uint8Array, { nullable: true }),
    },
    {
        identifier: "SwarmSeccompOpts",
        title: "swarm.SeccompOpts",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L44-L53",
    }
) {}
