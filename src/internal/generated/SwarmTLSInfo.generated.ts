import * as Schema from "effect/Schema";

export class SwarmTLSInfo extends Schema.Class<SwarmTLSInfo>("SwarmTLSInfo")(
    {
        TrustRoot: Schema.optional(Schema.String),
        CertIssuerSubject: Schema.optional(Schema.NullOr(Schema.Array(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 2 ** 8 - 1 }))))),
        CertIssuerPublicKey: Schema.optional(Schema.NullOr(Schema.Array(Schema.Int.check(Schema.isBetween({ minimum: 0, maximum: 2 ** 8 - 1 }))))),
    },
    {
        identifier: "SwarmTLSInfo",
        title: "swarm.TLSInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TLSInfo",
    }
) {}
