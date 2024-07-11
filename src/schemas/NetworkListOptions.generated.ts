import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkListOptions extends Schema.Class<NetworkListOptions>("NetworkListOptions")({
    Filters: MobySchemas.Args,
}) {}
