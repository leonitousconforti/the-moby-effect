import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class DefaultNetworkSettings extends Schema.Class<DefaultNetworkSettings>("DefaultNetworkSettings")(
    {
        EndpointID: Schema.NullOr(Schema.String),
        Gateway: Schema.NullOr(Schema.String),
        GlobalIPv6Address: Schema.NullOr(Schema.String),
        GlobalIPv6PrefixLen: Schema.NullOr(MobySchemas.Int64),
        IPAddress: Schema.NullOr(Schema.String),
        IPPrefixLen: Schema.NullOr(MobySchemas.Int64),
        IPv6Gateway: Schema.NullOr(Schema.String),
        MacAddress: Schema.NullOr(Schema.String),
    },
    {
        identifier: "DefaultNetworkSettings",
        title: "types.DefaultNetworkSettings",
    }
) {}
