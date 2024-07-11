import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Info extends Schema.Class<Info>("Info")({
    NodeID: Schema.String,
    NodeAddr: Schema.String,
    LocalNodeState: Schema.String,
    ControlAvailable: Schema.Boolean,
    Error: Schema.String,
    RemoteManagers: Schema.Array(MobySchemas.Peer),
    Nodes: MobySchemas.Int64,
    Managers: MobySchemas.Int64,
    Cluster: MobySchemas.ClusterInfo,
    Warnings: Schema.Array(Schema.String),
}) {}
