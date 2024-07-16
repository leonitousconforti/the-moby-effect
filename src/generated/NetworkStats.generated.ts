import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkStats extends Schema.Class<NetworkStats>("NetworkStats")(
    {
        rx_bytes: MobySchemas.UInt64,
        rx_packets: MobySchemas.UInt64,
        rx_errors: MobySchemas.UInt64,
        rx_dropped: MobySchemas.UInt64,
        tx_bytes: MobySchemas.UInt64,
        tx_packets: MobySchemas.UInt64,
        tx_errors: MobySchemas.UInt64,
        tx_dropped: MobySchemas.UInt64,
        endpoint_id: Schema.optional(Schema.String),
        instance_id: Schema.optional(Schema.String),
    },
    {
        identifier: "NetworkStats",
        title: "types.NetworkStats",
    }
) {}
