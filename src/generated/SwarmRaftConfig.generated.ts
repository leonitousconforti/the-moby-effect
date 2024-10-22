import * as Schema from "effect/Schema";
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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L72-L100",
    }
) {}
