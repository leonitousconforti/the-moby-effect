import * as Schema from "@effect/schema/Schema";

export class EndpointResource extends Schema.Class<EndpointResource>("EndpointResource")(
    {
        Name: Schema.NullOr(Schema.String),
        EndpointID: Schema.NullOr(Schema.String),
        MacAddress: Schema.NullOr(Schema.String),
        IPv4Address: Schema.NullOr(Schema.String),
        IPv6Address: Schema.NullOr(Schema.String),
    },
    {
        identifier: "EndpointResource",
        title: "types.EndpointResource",
    }
) {}
