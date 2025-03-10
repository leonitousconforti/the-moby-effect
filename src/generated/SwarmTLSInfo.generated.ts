import * as Schema from "effect/Schema";

export class SwarmTLSInfo extends Schema.Class<SwarmTLSInfo>("SwarmTLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String),
        CertIssuerSubject: Schema.optionalWith(Schema.String, { nullable: true }),
        CertIssuerPublicKey: Schema.optionalWith(Schema.String, { nullable: true }),
    },
    {
        identifier: "SwarmTLSInfo",
        title: "swarm.TLSInfo",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/common.go#L37-L48",
    }
) {}
