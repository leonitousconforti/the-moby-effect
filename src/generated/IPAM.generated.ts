import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class IPAM extends Schema.Class<IPAM>("IPAM")(
    {
        Driver: Schema.NullOr(Schema.String),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Config: Schema.NullOr(Schema.Array(MobySchemasGenerated.IPAMConfig)),
    },
    {
        identifier: "IPAM",
        title: "network.IPAM",
    }
) {}
