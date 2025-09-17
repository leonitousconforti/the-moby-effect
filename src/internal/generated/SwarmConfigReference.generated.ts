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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ConfigReference",
    }
) {}
