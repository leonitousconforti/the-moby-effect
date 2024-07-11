import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkStats extends Schema.Class<NetworkStats>("NetworkStats")({
    RxBytes: MobySchemas.UInt64,
    RxPackets: MobySchemas.UInt64,
    RxErrors: MobySchemas.UInt64,
    RxDropped: MobySchemas.UInt64,
    TxBytes: MobySchemas.UInt64,
    TxPackets: MobySchemas.UInt64,
    TxErrors: MobySchemas.UInt64,
    TxDropped: MobySchemas.UInt64,
    EndpointID: Schema.String,
    InstanceID: Schema.String,
}) {}
