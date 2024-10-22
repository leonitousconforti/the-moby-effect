import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";

export class SwarmNodeSpec extends Schema.Class<SwarmNodeSpec>("SwarmNodeSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Role: Schema.optional(Schema.String),
        Availability: Schema.optional(Schema.String),
    },
    {
        identifier: "SwarmNodeSpec",
        title: "swarm.NodeSpec",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/node.go#L20-L25",
    }
) {}
