import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRaftConfig extends Schema.Class<SwarmRaftConfig>("SwarmRaftConfig")(
    {
        SnapshotInterval: Schema.optional(MobySchemas.UInt64),
        KeepOldSnapshots: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),
        LogEntriesForSlowFollowers: Schema.optional(MobySchemas.UInt64),
        ElectionTick: MobySchemas.Int64,
        HeartbeatTick: MobySchemas.Int64,
    },
    {
        identifier: "SwarmRaftConfig",
        title: "swarm.RaftConfig",
    }
) {}
