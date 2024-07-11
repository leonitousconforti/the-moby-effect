import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class SummaryNetworkSettings extends Schema.Class<SummaryNetworkSettings>("SummaryNetworkSettings")({
    Networks: Schema.Record(Schema.String, MobySchemas.EndpointSettings),
}) {}
