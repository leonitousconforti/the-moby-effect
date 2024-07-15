import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class EndpointSettings extends Schema.Class<EndpointSettings>("EndpointSettings")(
    {
        IPAMConfig: Schema.NullOr(MobySchemasGenerated.EndpointIPAMConfig),
        Links: Schema.NullOr(Schema.Array(Schema.String)),
        Aliases: Schema.NullOr(Schema.Array(Schema.String)),
        NetworkID: Schema.NullOr(Schema.String),
        EndpointID: Schema.NullOr(Schema.String),
        Gateway: Schema.NullOr(Schema.String),
        IPAddress: Schema.NullOr(Schema.String),
        IPPrefixLen: Schema.NullOr(MobySchemas.Int64),
        IPv6Gateway: Schema.NullOr(Schema.String),
        GlobalIPv6Address: Schema.NullOr(Schema.String),
        GlobalIPv6PrefixLen: Schema.NullOr(MobySchemas.Int64),
        MacAddress: Schema.NullOr(Schema.String),
        DriverOpts: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "EndpointSettings",
        title: "network.EndpointSettings",
    }
) {}
