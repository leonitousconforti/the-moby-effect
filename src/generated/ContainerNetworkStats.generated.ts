import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ContainerNetworkStats extends Schema.Class<ContainerNetworkStats>("ContainerNetworkStats")(
    {
        /** Bytes received. Windows and Linux. */
        rx_bytes: MobySchemas.UInt64,

        /** Packets received. Windows and Linux. */
        rx_packets: MobySchemas.UInt64,

        /** Received errors. Not used on Windows. */
        rx_errors: MobySchemas.UInt64,

        /** Incoming packets dropped. Windows and Linux. */
        rx_dropped: MobySchemas.UInt64,

        /** Bytes sent. Windows and Linux. */
        tx_bytes: MobySchemas.UInt64,

        /** Packets sent. Windows and Linux. */
        tx_packets: MobySchemas.UInt64,

        /** Sent errors. Not used on Windows. */
        tx_errors: MobySchemas.UInt64,

        /** Outgoing packets dropped. Windows and Linux. */
        tx_dropped: MobySchemas.UInt64,

        /** Endpoint ID. Not used on Linux. */
        endpoint_id: Schema.optional(Schema.String),

        /** Instance ID. Not used on Linux. */
        instance_id: Schema.optional(Schema.String),
    },
    {
        identifier: "ContainerNetworkStats",
        title: "container.NetworkStats",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/stats.go#L115-L139",
    }
) {}
