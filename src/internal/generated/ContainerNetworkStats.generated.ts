import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class ContainerNetworkStats extends Schema.Class<ContainerNetworkStats>("ContainerNetworkStats")(
    {
        rx_bytes: EffectSchemas.Number.U64,
        rx_packets: EffectSchemas.Number.U64,
        rx_errors: EffectSchemas.Number.U64,
        rx_dropped: EffectSchemas.Number.U64,
        tx_bytes: EffectSchemas.Number.U64,
        tx_packets: EffectSchemas.Number.U64,
        tx_errors: EffectSchemas.Number.U64,
        tx_dropped: EffectSchemas.Number.U64,
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
