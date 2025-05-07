import * as Schema from "effect/Schema";

export class NetworkPruneResponse extends Schema.Class<NetworkPruneResponse>("NetworkPruneResponse")(
    {
        NetworksDeleted: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkPruneResponse",
        title: "network.PruneReport",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L164-L168",
    }
) {}
