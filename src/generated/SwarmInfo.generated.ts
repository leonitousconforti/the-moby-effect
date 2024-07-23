import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmInfo extends Schema.Class<SwarmInfo>("SwarmInfo")(
    {
        NodeID: Schema.String,
        NodeAddr: Schema.String,
        LocalNodeState: Schema.String,
        ControlAvailable: Schema.Boolean,
        Error: Schema.String,
        RemoteManagers: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmPeer))),
        Nodes: Schema.optional(MobySchemas.Int64),
        Managers: Schema.optional(MobySchemas.Int64),
        Cluster: Schema.optional(MobySchemasGenerated.SwarmClusterInfo, { nullable: true }),
        Warnings: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmInfo",
        title: "swarm.Info",
    }
) {}
