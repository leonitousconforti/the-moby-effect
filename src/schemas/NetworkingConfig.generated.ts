import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkingConfig extends Schema.Class<NetworkingConfig>("NetworkingConfig")({
    EndpointsConfig: Schema.Record(Schema.String, MobySchemas.EndpointSettings),
}) {}
