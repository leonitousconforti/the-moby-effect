import * as Schema from "@effect/schema/Schema";

export class EndpointVirtualIP extends Schema.Class<EndpointVirtualIP>("EndpointVirtualIP")({
    NetworkID: Schema.String,
    Addr: Schema.String,
}) {}
