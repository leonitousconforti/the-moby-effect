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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ReplicatedService",
    }
) {}
