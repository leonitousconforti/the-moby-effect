import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Swarm extends Schema.Class<Swarm>("Swarm")({
    ID: Schema.String,
    Version: MobySchemas.Version,
    CreatedAt: MobySchemas.Time,
    UpdatedAt: MobySchemas.Time,
    Spec: MobySchemas.Spec,
    TLSInfo: MobySchemas.TLSInfo,
    RootRotationInProgress: Schema.Boolean,
    DefaultAddrPool: Schema.Array(Schema.String),
    SubnetSize: MobySchemas.UInt32,
    DataPathPort: MobySchemas.UInt32,
    JoinTokens: MobySchemas.JoinTokens,
}) {}