import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class SwarmRaftConfig extends Schema.Class<SwarmRaftConfig>("SwarmRaftConfig")(
    {
        SnapshotInterval: Schema.optional(EffectSchemas.Number.U64),
        KeepOldSnapshots: Schema.optionalWith(EffectSchemas.Number.U64, { nullable: true }),
        LogEntriesForSlowFollowers: Schema.optional(EffectSchemas.Number.U64),
        ElectionTick: EffectSchemas.Number.I64,
        HeartbeatTick: EffectSchemas.Number.I64,
    },
    {
        identifier: "SwarmRaftConfig",
        title: "swarm.RaftConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#RaftConfig",
    }
) {}
