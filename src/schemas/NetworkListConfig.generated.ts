import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkListConfig extends Schema.Class<NetworkListConfig>("NetworkListConfig")({
    Detailed: Schema.Boolean,
    Verbose: Schema.Boolean,
}) {}
