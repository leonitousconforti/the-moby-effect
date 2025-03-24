import * as Schema from "effect/Schema";

export class NetworkPruneResponse extends Schema.Class<NetworkPruneResponse>("NetworkPruneResponse")(
    {
        NetworksDeleted: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkPruneResponse",
        title: "network.PruneReport",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L162-L166",
    }
) {}
