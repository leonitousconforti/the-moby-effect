import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";

export class SwarmRaftConfig extends Schema.Class<SwarmRaftConfig>("SwarmRaftConfig")(
    {
        SnapshotInterval: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        KeepOldSnapshots: Schema.optional(
            Schema.NullOr(
                MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
            )
        ),
        LogEntriesForSlowFollowers: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
        ElectionTick: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        HeartbeatTick: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
    },
    {
        identifier: "SwarmRaftConfig",
        title: "swarm.RaftConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#RaftConfig",
    }
) {}
