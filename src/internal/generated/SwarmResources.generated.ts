import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmGenericResource from "./SwarmGenericResource.generated.js";

export class SwarmResources extends Schema.Class<SwarmResources>("SwarmResources")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64),
        MemoryBytes: Schema.optional(MobySchemas.Int64),
        GenericResources: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmGenericResource.SwarmGenericResource)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmResources",
        title: "swarm.Resources",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#Resources",
    }
) {}
