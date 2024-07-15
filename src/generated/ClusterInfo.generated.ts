import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ClusterInfo extends Schema.Class<ClusterInfo>("ClusterInfo")(
    {
        ID: Schema.NullOr(Schema.String),
        Version: Schema.optional(MobySchemasGenerated.Version),
        CreatedAt: Schema.optional(MobySchemasGenerated.Time),
        UpdatedAt: Schema.optional(MobySchemasGenerated.Time),
        Spec: MobySchemasGenerated.Spec,
        TLSInfo: MobySchemasGenerated.TLSInfo,
        RootRotationInProgress: Schema.NullOr(Schema.Boolean),
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: Schema.NullOr(MobySchemas.UInt32),
        DataPathPort: Schema.NullOr(MobySchemas.UInt32),
    },
    {
        identifier: "ClusterInfo",
        title: "swarm.ClusterInfo",
    }
) {}
