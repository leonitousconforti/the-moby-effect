import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class IPAMOptions extends Schema.Class<IPAMOptions>("IPAMOptions")({
    Driver: MobySchemas.Driver,
    Configs: Schema.Array(MobySchemas.IPAMConfig),
}) {}
