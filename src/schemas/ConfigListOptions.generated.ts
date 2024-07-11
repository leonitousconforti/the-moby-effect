import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ConfigListOptions extends Schema.Class<ConfigListOptions>("ConfigListOptions")({
    Filters: MobySchemas.Args,
}) {}
