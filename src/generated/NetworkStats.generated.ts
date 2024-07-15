import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class NetworkStats extends Schema.Class<NetworkStats>("NetworkStats")(
    {
        rx_bytes: Schema.NullOr(MobySchemas.UInt64),
        rx_packets: Schema.NullOr(MobySchemas.UInt64),
        rx_errors: Schema.NullOr(MobySchemas.UInt64),
        rx_dropped: Schema.NullOr(MobySchemas.UInt64),
        tx_bytes: Schema.NullOr(MobySchemas.UInt64),
        tx_packets: Schema.NullOr(MobySchemas.UInt64),
        tx_errors: Schema.NullOr(MobySchemas.UInt64),
        tx_dropped: Schema.NullOr(MobySchemas.UInt64),
        endpoint_id: Schema.optional(Schema.String, { nullable: true }),
        instance_id: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "NetworkStats",
        title: "types.NetworkStats",
    }
) {}
