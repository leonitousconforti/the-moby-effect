import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkCreateOptions extends Schema.Class<NetworkCreateOptions>("NetworkCreateOptions")(
    {
        Driver: Schema.String,
        Scope: Schema.String,
        EnableIPv6: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        IPAM: Schema.NullOr(MobySchemasGenerated.NetworkIPAM),
        Internal: Schema.Boolean,
        Attachable: Schema.Boolean,
        Ingress: Schema.Boolean,
        ConfigOnly: Schema.Boolean,
        ConfigFrom: Schema.NullOr(MobySchemasGenerated.NetworkConfigReference),
        Options: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
        Labels: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "NetworkCreateOptions",
        title: "network.CreateOptions",
    }
) {}
