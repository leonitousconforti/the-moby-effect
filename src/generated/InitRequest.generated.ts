import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class InitRequest extends Schema.Class<InitRequest>("InitRequest")(
    {
        ListenAddr: Schema.NullOr(Schema.String),
        AdvertiseAddr: Schema.NullOr(Schema.String),
        DataPathAddr: Schema.NullOr(Schema.String),
        DataPathPort: Schema.NullOr(MobySchemas.UInt32),
        ForceNewCluster: Schema.NullOr(Schema.Boolean),
        Spec: MobySchemasGenerated.Spec,
        AutoLockManagers: Schema.NullOr(Schema.Boolean),
        Availability: Schema.NullOr(Schema.String),
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)),
        SubnetSize: Schema.NullOr(MobySchemas.UInt32),
    },
    {
        identifier: "InitRequest",
        title: "swarm.InitRequest",
    }
) {}
