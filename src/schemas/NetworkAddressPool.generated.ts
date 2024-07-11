import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkAddressPool extends Schema.Class<NetworkAddressPool>("NetworkAddressPool")({
    Base: Schema.String,
    Size: MobySchemas.Int64,
}) {}
