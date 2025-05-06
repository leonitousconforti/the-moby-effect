import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";

export class SwarmNodeSpec extends Schema.Class<SwarmNodeSpec>("SwarmNodeSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Role: Schema.optional(
            Schema.Literal("worker", "manager").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L27-L35",
            })
        ),
        Availability: Schema.optional(
            Schema.Literal("active", "pause", "drain").annotations({
                documentation:
                    "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L37-L47",
            })
        ),
    },
    {
        identifier: "SwarmNodeSpec",
        title: "swarm.NodeSpec",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/node.go#L20-L25",
    }
) {}
