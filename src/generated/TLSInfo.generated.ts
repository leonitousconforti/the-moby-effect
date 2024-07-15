import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class TLSInfo extends Schema.Class<TLSInfo>("TLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String, { nullable: true }),
        CertIssuerSubject: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        CertIssuerPublicKey: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "TLSInfo",
        title: "swarm.TLSInfo",
    }
) {}
