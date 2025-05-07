import * as Schema from "effect/Schema";

export class SwarmAppArmorOpts extends Schema.Class<SwarmAppArmorOpts>("SwarmAppArmorOpts")(
    {
        Mode: Schema.optional(
            Schema.Literal("default", "disabled").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L55-L62",
            })
        ),
    },
    {
        identifier: "SwarmAppArmorOpts",
        title: "swarm.AppArmorOpts",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L64-L68",
    }
) {}
