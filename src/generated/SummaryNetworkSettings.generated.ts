import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SummaryNetworkSettings extends Schema.Class<SummaryNetworkSettings>("SummaryNetworkSettings")(
    {
        Networks: Schema.NullOr(
            Schema.Record(Schema.String, Schema.NullOr(MobySchemasGenerated.NetworkEndpointSettings))
        ),
    },
    {
        identifier: "SummaryNetworkSettings",
        title: "types.SummaryNetworkSettings",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L291-L295",
    }
) {}
