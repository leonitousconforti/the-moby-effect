import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetworkSpec extends Schema.Class<NetworkSpec>("NetworkSpec")({
    Name: Schema.String,
    Labels: Schema.Record(Schema.String, Schema.String),
    DriverConfiguration: MobySchemas.Driver,
    IPv6Enabled: Schema.Boolean,
    Internal: Schema.Boolean,
    Attachable: Schema.Boolean,
    Ingress: Schema.Boolean,
    IPAMOptions: MobySchemas.IPAMOptions,
    ConfigFrom: MobySchemas.ConfigReference,
    Scope: Schema.String,
}) {}
