import * as Schema from "effect/Schema";

export class SwarmTLSInfo extends Schema.Class<SwarmTLSInfo>("SwarmTLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String),
        CertIssuerSubject: Schema.optionalWith(Schema.Uint8Array, { nullable: true }),
        CertIssuerPublicKey: Schema.optionalWith(Schema.Uint8Array, { nullable: true }),
    },
    {
        identifier: "SwarmTLSInfo",
        title: "swarm.TLSInfo",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/common.go#L37-L48",
    }
) {}
