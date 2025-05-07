import * as Schema from "effect/Schema";
import * as SwarmConfigReferenceFileTarget from "./SwarmConfigReferenceFileTarget.generated.js";
import * as SwarmConfigReferenceRuntimeTarget from "./SwarmConfigReferenceRuntimeTarget.generated.js";

export class SwarmConfigReference extends Schema.Class<SwarmConfigReference>("SwarmConfigReference")(
    {
        File: Schema.optionalWith(SwarmConfigReferenceFileTarget.SwarmConfigReferenceFileTarget, { nullable: true }),
        Runtime: Schema.optionalWith(SwarmConfigReferenceRuntimeTarget.SwarmConfigReferenceRuntimeTarget, {
            nullable: true,
        }),
        ConfigID: Schema.String,
        ConfigName: Schema.String,
    },
    {
        identifier: "SwarmConfigReference",
        title: "swarm.ConfigReference",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/config.go#L40-L46",
    }
) {}
