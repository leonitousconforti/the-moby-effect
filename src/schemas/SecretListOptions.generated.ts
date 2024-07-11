import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SecretListOptions extends Schema.Class<SecretListOptions>("SecretListOptions")({
    Filters: MobySchemas.Args,
}) {}
