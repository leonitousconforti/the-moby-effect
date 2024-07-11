import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ServiceListOptions extends Schema.Class<ServiceListOptions>("ServiceListOptions")({
    Filters: MobySchemas.Args,
    Status: Schema.Boolean,
}) {}
