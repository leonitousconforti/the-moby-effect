import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class NetworkSettings extends Schema.Class<NetworkSettings>("NetworkSettings")(
    {
        Bridge: Schema.NullOr(Schema.String),
        SandboxID: Schema.NullOr(Schema.String),
        HairpinMode: Schema.NullOr(Schema.Boolean),
        LinkLocalIPv6Address: Schema.NullOr(Schema.String),
        LinkLocalIPv6PrefixLen: Schema.NullOr(MobySchemas.Int64),
        Ports: Schema.NullOr(Schema.Record(Schema.String, Schema.Array(MobySchemasGenerated.PortBinding))),
        SandboxKey: Schema.NullOr(Schema.String),
        SecondaryIPAddresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.Address)),
        SecondaryIPv6Addresses: Schema.NullOr(Schema.Array(MobySchemasGenerated.Address)),
        EndpointID: Schema.NullOr(Schema.String),
        Gateway: Schema.NullOr(Schema.String),
        GlobalIPv6Address: Schema.NullOr(Schema.String),
        GlobalIPv6PrefixLen: Schema.NullOr(MobySchemas.Int64),
        IPAddress: Schema.NullOr(Schema.String),
        IPPrefixLen: Schema.NullOr(MobySchemas.Int64),
        IPv6Gateway: Schema.NullOr(Schema.String),
        MacAddress: Schema.NullOr(Schema.String),
        Networks: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.EndpointSettings)),
    },
    {
        identifier: "NetworkSettings",
        title: "types.NetworkSettings",
    }
) {}
