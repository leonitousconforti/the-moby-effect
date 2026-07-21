import * as Schema from "effect/Schema";

import * as SwarmGenericResource from "./SwarmGenericResource.generated.ts";

export class SwarmResources extends Schema.Class<SwarmResources>("SwarmResources")(
    {
        NanoCPUs: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        MemoryBytes: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
        GenericResources: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource)))
        ),
    },
    {
        identifier: "SwarmResources",
        title: "swarm.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Resources",
    }
) {}
