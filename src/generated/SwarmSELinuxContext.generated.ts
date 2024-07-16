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
    }
) {}
