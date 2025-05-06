import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmRaftConfig extends Schema.Class<SwarmRaftConfig>("SwarmRaftConfig")(
    {
        /** SnapshotInterval is the number of log entries between snapshots. */
        SnapshotInterval: Schema.optional(MobySchemas.UInt64),

        /**
         * KeepOldSnapshots is the number of snapshots to keep beyond the
         * current snapshot.
         */
        KeepOldSnapshots: Schema.optionalWith(MobySchemas.UInt64, { nullable: true }),

        /**
         * LogEntriesForSlowFollowers is the number of log entries to keep
         * around to sync up slow followers after a snapshot is created.
         */
        LogEntriesForSlowFollowers: Schema.optional(MobySchemas.UInt64),

        /**
         * ElectionTick is the number of ticks that a follower will wait for a
         * message from the leader before becoming a candidate and starting an
         * election. ElectionTick must be greater than HeartbeatTick.
         *
         * A tick currently defaults to one second, so these translate directly
         * to seconds currently, but this is NOT guaranteed.
         */
        ElectionTick: MobySchemas.Int64,

        /**
         * HeartbeatTick is the number of ticks between heartbeats. Every
         * HeartbeatTick ticks, the leader will send a heartbeat to the
         * followers.
         *
         * A tick currently defaults to one second, so these translate directly
         * to seconds currently, but this is NOT guaranteed.
         */
        HeartbeatTick: MobySchemas.Int64,
    },
    {
        identifier: "SwarmRaftConfig",
        title: "swarm.RaftConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L72-L100",
    }
) {}
