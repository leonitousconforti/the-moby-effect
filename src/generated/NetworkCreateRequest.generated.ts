import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkCreateRequest extends Schema.Class<NetworkCreateRequest>("NetworkCreateRequest")(
    {
        CheckDuplicate: Schema.NullOr(Schema.Boolean),
        Driver: Schema.NullOr(Schema.String),
        Scope: Schema.NullOr(Schema.String),
        EnableIPv6: Schema.NullOr(Schema.Boolean),
        IPAM: Schema.NullOr(MobySchemasGenerated.IPAM),
        Internal: Schema.NullOr(Schema.Boolean),
        Attachable: Schema.NullOr(Schema.Boolean),
        Ingress: Schema.NullOr(Schema.Boolean),
        ConfigOnly: Schema.NullOr(Schema.Boolean),
        ConfigFrom: Schema.NullOr(MobySchemasGenerated.ConfigReference),
        Options: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Name: Schema.NullOr(Schema.String),
    },
    {
        identifier: "NetworkCreateRequest",
        title: "types.NetworkCreateRequest",
    }
) {}
