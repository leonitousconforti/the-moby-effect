import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmReplicatedService extends Schema.Class<SwarmReplicatedService>("SwarmReplicatedService")(
    {
        Replicas: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "SwarmReplicatedService",
        title: "swarm.ReplicatedService",
    }
) {}
