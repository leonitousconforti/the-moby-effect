import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmExternalCA from "./SwarmExternalCA.generated.js";

export class SwarmCAConfig extends Schema.Class<SwarmCAConfig>("SwarmCAConfig")(
    {
        NodeCertExpiry: Schema.optional(MobySchemas.Int64),
        ExternalCAs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmExternalCA.SwarmExternalCA)), {
            nullable: true,
        }),
        SigningCACert: Schema.optional(Schema.String),
        SigningCAKey: Schema.optional(Schema.String),
        ForceRotate: Schema.optional(MobySchemas.UInt64),
    },
    {
        identifier: "SwarmCAConfig",
        title: "swarm.CAConfig",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/swarm/swarm.go#L109-L127",
    }
) {}
