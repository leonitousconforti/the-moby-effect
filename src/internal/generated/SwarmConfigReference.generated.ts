import * as Schema from "effect/Schema";

import * as SwarmConfigReferenceFileTarget from "./SwarmConfigReferenceFileTarget.generated.ts";
import * as SwarmConfigReferenceRuntimeTarget from "./SwarmConfigReferenceRuntimeTarget.generated.ts";

export class SwarmConfigReference extends Schema.Class<SwarmConfigReference>("SwarmConfigReference")(
    {
        File: Schema.optional(Schema.NullOr(SwarmConfigReferenceFileTarget.SwarmConfigReferenceFileTarget)),
        Runtime: Schema.optional(Schema.NullOr(SwarmConfigReferenceRuntimeTarget.SwarmConfigReferenceRuntimeTarget)),
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
