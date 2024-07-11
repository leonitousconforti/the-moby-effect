import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkAttachment extends Schema.Class<NetworkAttachment>("NetworkAttachment")({
    Network: MobySchemas.Network,
    Addresses: Schema.Array(Schema.String),
}) {}
