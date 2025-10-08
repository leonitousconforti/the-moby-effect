import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as SwarmExternalCA from "./SwarmExternalCA.generated.js";

export class SwarmCAConfig extends Schema.Class<SwarmCAConfig>("SwarmCAConfig")(
    {
        NodeCertExpiry: Schema.optional(EffectSchemas.Number.I64),
        ExternalCAs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmExternalCA.SwarmExternalCA)), {
            nullable: true,
        }),
        SigningCACert: Schema.optional(Schema.String),
        SigningCAKey: Schema.optional(Schema.String),
        ForceRotate: Schema.optional(EffectSchemas.Number.U64),
    },
    {
        identifier: "SwarmCAConfig",
        title: "swarm.CAConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#CAConfig",
    }
) {}
