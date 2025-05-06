import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmReplicatedService extends Schema.Class<SwarmReplicatedService>("SwarmReplicatedService")(
    {
        Replicas: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedService",
        title: "swarm.ReplicatedService",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/service.go#L78-L81",
    }
) {}
