import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PortStatus extends Schema.Class<PortStatus>("PortStatus")({
    Ports: Schema.Array(MobySchemas.PortConfig),
}) {}
