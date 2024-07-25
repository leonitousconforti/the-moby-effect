import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmClusterInfo extends Schema.Class<SwarmClusterInfo>("SwarmClusterInfo")(
    {
        ID: Schema.String,
        Version: Schema.optionalWith(MobySchemasGenerated.SwarmVersion, { nullable: true }),
        CreatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        UpdatedAt: Schema.optionalWith(MobySchemasGenerated.Time, { nullable: true }),
        Spec: Schema.NullOr(MobySchemasGenerated.SwarmSpec),
        TLSInfo: Schema.NullOr(MobySchemasGenerated.SwarmTLSInfo),
        RootRotationInProgress: Schema.Boolean,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
        DataPathPort: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmClusterInfo",
        title: "swarm.ClusterInfo",
    }
) {}
