import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>("SwarmInitRequest")(
    {
        ListenAddr: Schema.String,
        AdvertiseAddr: Schema.String,
        DataPathAddr: Schema.String,
        DataPathPort: MobySchemas.UInt32,
        ForceNewCluster: Schema.Boolean,
        Spec: MobySchemasGenerated.SwarmSpec,
        AutoLockManagers: Schema.Boolean,
        Availability: Schema.String,
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: MobySchemas.UInt32,
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
    }
) {}
