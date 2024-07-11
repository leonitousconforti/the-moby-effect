import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ListOptions extends Schema.Class<ListOptions>("ListOptions")({
    Filters: MobySchemas.Args,
}) {}
