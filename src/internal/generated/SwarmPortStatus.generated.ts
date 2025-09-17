import * as Schema from "effect/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmPortStatus extends Schema.Class<SwarmPortStatus>("SwarmPortStatus")(
    {
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmPortStatus",
        title: "swarm.PortStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PortStatus",
    }
) {}
