import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class RaftConfig extends Schema.Class<RaftConfig>("RaftConfig")(
    {
        SnapshotInterval: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        KeepOldSnapshots: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        LogEntriesForSlowFollowers: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        ElectionTick: Schema.NullOr(MobySchemas.Int64),
        HeartbeatTick: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "RaftConfig",
        title: "swarm.RaftConfig",
    }
) {}
