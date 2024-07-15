import * as Schema from "@effect/schema/Schema";

export class NetworkInspectOptions extends Schema.Class<NetworkInspectOptions>("NetworkInspectOptions")(
    {
        Scope: Schema.NullOr(Schema.String),
        Verbose: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "NetworkInspectOptions",
        title: "types.NetworkInspectOptions",
    }
) {}
