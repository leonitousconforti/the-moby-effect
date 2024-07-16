import * as Schema from "@effect/schema/Schema";

export class EndpointResource extends Schema.Class<EndpointResource>("EndpointResource")(
    {
        Name: Schema.String,
        EndpointID: Schema.String,
        MacAddress: Schema.String,
        IPv4Address: Schema.String,
        IPv6Address: Schema.String,
    },
    {
        identifier: "EndpointResource",
        title: "types.EndpointResource",
    }
) {}
