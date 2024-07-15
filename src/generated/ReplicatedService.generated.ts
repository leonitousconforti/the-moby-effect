import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ReplicatedService extends Schema.Class<ReplicatedService>("ReplicatedService")(
    {
        Replicas: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "ReplicatedService",
        title: "swarm.ReplicatedService",
    }
) {}
