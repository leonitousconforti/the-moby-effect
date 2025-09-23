import * as Schema from "effect/Schema";
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
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#TLSInfo",
    }
) {}
