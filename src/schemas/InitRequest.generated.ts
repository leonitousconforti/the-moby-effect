import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class InitRequest extends Schema.Class<InitRequest>("InitRequest")({
    ListenAddr: Schema.String,
    AdvertiseAddr: Schema.String,
    DataPathAddr: Schema.String,
    DataPathPort: MobySchemas.UInt32,
    ForceNewCluster: Schema.Boolean,
    Spec: MobySchemas.Spec,
    AutoLockManagers: Schema.Boolean,
    Availability: Schema.String,
    DefaultAddrPool: Schema.Array(Schema.String),
    SubnetSize: MobySchemas.UInt32,
}) {}
