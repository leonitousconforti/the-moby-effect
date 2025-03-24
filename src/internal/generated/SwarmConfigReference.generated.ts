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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/config.go#L34-L40",
    }
) {}
