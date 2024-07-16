import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmTLSInfo extends Schema.Class<SwarmTLSInfo>("SwarmTLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String),
        CertIssuerSubject: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        CertIssuerPublicKey: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "SwarmTLSInfo",
        title: "swarm.TLSInfo",
    }
) {}
