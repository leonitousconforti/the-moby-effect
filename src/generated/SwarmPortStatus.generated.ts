import * as Schema from "@effect/schema/Schema";
import * as SwarmPortConfig from "./SwarmPortConfig.generated.js";

export class SwarmPortStatus extends Schema.Class<SwarmPortStatus>("SwarmPortStatus")(
    {
        Ports: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmPortConfig.SwarmPortConfig)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmPortStatus",
        title: "swarm.PortStatus",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/task.go#L207-L211",
    }
) {}
