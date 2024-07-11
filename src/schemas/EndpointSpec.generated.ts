import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class EndpointSpec extends Schema.Class<EndpointSpec>("EndpointSpec")({
    Mode: Schema.String,
    Ports: Schema.Array(MobySchemas.PortConfig),
}) {}
