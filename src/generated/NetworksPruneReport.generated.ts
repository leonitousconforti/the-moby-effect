import * as Schema from "@effect/schema/Schema";

export class NetworksPruneReport extends Schema.Class<NetworksPruneReport>("NetworksPruneReport")(
    {
        NetworksDeleted: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "NetworksPruneReport",
        title: "types.NetworksPruneReport",
    }
) {}
