import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkIPAM extends Schema.Class<NetworkIPAM>("NetworkIPAM")(
    {
        Driver: Schema.String,
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Config: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.NetworkIPAMConfig))),
    },
    {
        identifier: "NetworkIPAM",
        title: "network.IPAM",
    }
) {}
