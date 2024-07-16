import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SummaryNetworkSettings extends Schema.Class<SummaryNetworkSettings>("SummaryNetworkSettings")(
    {
        Networks: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.NetworkEndpointSettings)),
    },
    {
        identifier: "SummaryNetworkSettings",
        title: "types.SummaryNetworkSettings",
    }
) {}
