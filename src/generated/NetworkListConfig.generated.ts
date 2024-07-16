import * as Schema from "@effect/schema/Schema";

export class NetworkListConfig extends Schema.Class<NetworkListConfig>("NetworkListConfig")(
    {
        Detailed: Schema.Boolean,
        Verbose: Schema.Boolean,
    },
    {
        identifier: "NetworkListConfig",
        title: "types.NetworkListConfig",
    }
) {}
