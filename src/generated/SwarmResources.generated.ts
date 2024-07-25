import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmResources extends Schema.Class<SwarmResources>("SwarmResources")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64),
        MemoryBytes: Schema.optional(MobySchemas.Int64),
        GenericResources: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmGenericResource)), {
            nullable: true,
        }),
    },
    {
        identifier: "SwarmResources",
        title: "swarm.Resources",
    }
) {}
