import * as Schema from "effect/Schema";

import * as SwarmPortConfig from "./SwarmPortConfig.generated.ts";

export class SwarmPortStatus extends Schema.Class<SwarmPortStatus>("SwarmPortStatus")(
    {
        Ports: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)))),
    },
    {
        identifier: "SwarmPortStatus",
        title: "swarm.PortStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#PortStatus",
    }
) {}
