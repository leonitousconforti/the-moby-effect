import * as Schema from "effect/Schema";

import * as SwarmAnnotations from "./SwarmAnnotations.generated.ts";

export class SwarmNodeSpec extends Schema.Class<SwarmNodeSpec>("SwarmNodeSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Role: Schema.optional(Schema.Literals(["worker", "manager"])),
        Availability: Schema.optional(Schema.Literals(["active", "pause", "drain"])),
    },
    {
        identifier: "SwarmNodeSpec",
        title: "swarm.NodeSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeSpec",
    }
) {}
