import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NodeListOptions extends Schema.Class<NodeListOptions>("NodeListOptions")({
    Filters: MobySchemas.Args,
}) {}
