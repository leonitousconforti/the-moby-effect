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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#SELinuxContext",
    }
) {}
