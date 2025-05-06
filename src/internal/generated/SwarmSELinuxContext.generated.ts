import * as Schema from "effect/Schema";

export class SwarmSELinuxContext extends Schema.Class<SwarmSELinuxContext>("SwarmSELinuxContext")(
    {
        Disable: Schema.Boolean,
        User: Schema.String,
        Role: Schema.String,
        Type: Schema.String,
        Level: Schema.String,
    },
    {
        identifier: "SwarmSELinuxContext",
        title: "swarm.SELinuxContext",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/container.go#L24-L32",
    }
) {}
