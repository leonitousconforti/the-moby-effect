import * as Schema from "@effect/schema/Schema";

export class NetworkListConfig extends Schema.Class<NetworkListConfig>("NetworkListConfig")(
    {
        Detailed: Schema.NullOr(Schema.Boolean),
        Verbose: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "NetworkListConfig",
        title: "types.NetworkListConfig",
    }
) {}
