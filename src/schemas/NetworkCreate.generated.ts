import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkCreate extends Schema.Class<NetworkCreate>("NetworkCreate")({
    CheckDuplicate: Schema.Boolean,
    Driver: Schema.String,
    Scope: Schema.String,
    EnableIPv6: Schema.Boolean,
    IPAM: MobySchemas.IPAM,
    Internal: Schema.Boolean,
    Attachable: Schema.Boolean,
    Ingress: Schema.Boolean,
    ConfigOnly: Schema.Boolean,
    ConfigFrom: MobySchemas.ConfigReference,
    Options: Schema.Record(Schema.String, Schema.String),
    Labels: Schema.Record(Schema.String, Schema.String),
}) {}
