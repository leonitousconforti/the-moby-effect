import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkConnect extends Schema.Class<NetworkConnect>("NetworkConnect")({
    Container: Schema.String,
    EndpointConfig: MobySchemas.EndpointSettings,
}) {}
