import * as Schema from "@effect/schema/Schema";

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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L24-L32",
    }
) {}
