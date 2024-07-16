import * as Schema from "@effect/schema/Schema";

export class NetworkPruneResponse extends Schema.Class<NetworkPruneResponse>("NetworkPruneResponse")(
    {
        NetworksDeleted: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworkPruneResponse",
        title: "types.NetworksPruneReport",
    }
) {}
