import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TLSInfo extends Schema.Class<TLSInfo>("TLSInfo")({
    TrustRoot: Schema.String,
    CertIssuerSubject: Schema.Array(MobySchemas.UInt8),
    CertIssuerPublicKey: Schema.Array(MobySchemas.UInt8),
}) {}
