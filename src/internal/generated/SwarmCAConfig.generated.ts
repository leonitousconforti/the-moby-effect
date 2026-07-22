import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as SwarmExternalCA from "./SwarmExternalCA.generated.ts";

export class SwarmCAConfig extends Schema.Class<SwarmCAConfig>("SwarmCAConfig")(
    {
        NodeCertExpiry: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        ExternalCAs: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmExternalCA.SwarmExternalCA)))),
        SigningCACert: Schema.optional(Schema.String),
        SigningCAKey: Schema.optional(Schema.String),
        ForceRotate: Schema.optional(
            MobyNumber.BigIntFromWireString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n }))
        ),
    },
    {
        identifier: "SwarmCAConfig",
        title: "swarm.CAConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#CAConfig",
    }
) {}
