import * as Schema from "effect/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmPortStatus extends Schema.Class<SwarmPortStatus>("SwarmPortStatus")(
    {
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), { nullable: true }),
    },
    {
        identifier: "SwarmPortStatus",
        title: "swarm.PortStatus",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/task.go#L207-L211",
    }
) {}
