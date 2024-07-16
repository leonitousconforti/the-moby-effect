import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkCreate extends Schema.Class<NetworkCreate>("NetworkCreate")(
    {
        CheckDuplicate: Schema.Boolean,
        Driver: Schema.String,
        Scope: Schema.String,
        EnableIPv6: Schema.Boolean,
        IPAM: Schema.NullOr(MobySchemasGenerated.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigOnly: Schema.Boolean,
        ConfigFrom: Schema.NullOr(MobySchemasGenerated.NetworkConfigReference),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "NetworkCreate",
        title: "types.NetworkCreate",
    }
) {}
