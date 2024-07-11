import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class RaftConfig extends Schema.Class<RaftConfig>("RaftConfig")({
    SnapshotInterval: MobySchemas.UInt64,
    KeepOldSnapshots: MobySchemas.UInt64,
    LogEntriesForSlowFollowers: MobySchemas.UInt64,
    ElectionTick: MobySchemas.Int64,
    HeartbeatTick: MobySchemas.Int64,
}) {}
