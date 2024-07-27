import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmTLSInfo extends Schema.Class<SwarmTLSInfo>("SwarmTLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String),
        CertIssuerSubject: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        CertIssuerPublicKey: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
    },
    {
        identifier: "SwarmTLSInfo",
        title: "swarm.TLSInfo",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/common.go#L37-L48",
    }
) {}
