import * as Schema from "effect/Schema";
import * as SwarmAnnotations from "./SwarmAnnotations.generated.js";

export class SwarmNodeSpec extends Schema.Class<SwarmNodeSpec>("SwarmNodeSpec")(
    {
        ...SwarmAnnotations.SwarmAnnotations.fields,
        Role: Schema.optional(Schema.Literal("worker", "manager")),
        Availability: Schema.optional(Schema.Literal("active", "pause", "drain")),
    },
    {
        identifier: "SwarmNodeSpec",
        title: "swarm.NodeSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#NodeSpec",
    }
) {}
