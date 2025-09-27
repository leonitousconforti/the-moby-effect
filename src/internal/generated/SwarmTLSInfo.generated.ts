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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TLSInfo",
    }
) {}
