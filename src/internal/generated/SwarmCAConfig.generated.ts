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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L109-L127",
    }
) {}
