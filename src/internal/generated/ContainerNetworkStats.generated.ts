import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerNetworkStats extends Schema.Class<ContainerNetworkStats>("ContainerNetworkStats")(
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
        identifier: "ContainerNetworkStats",
        title: "container.NetworkStats",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#NetworkStats",
    }
) {}
