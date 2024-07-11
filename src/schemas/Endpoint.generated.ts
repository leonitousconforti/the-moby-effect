import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Endpoint extends Schema.Class<Endpoint>("Endpoint")({
    Spec: MobySchemas.EndpointSpec,
    Ports: Schema.Array(MobySchemas.PortConfig),
    VirtualIPs: Schema.Array(MobySchemas.EndpointVirtualIP),
}) {}
