import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Resources extends Schema.Class<Resources>("Resources")(
    {
        NanoCPUs: Schema.optional(MobySchemas.Int64, { nullable: true }),
        MemoryBytes: Schema.optional(MobySchemas.Int64, { nullable: true }),
        GenericResources: Schema.optional(Schema.Array(MobySchemasGenerated.GenericResource), { nullable: true }),
    },
    {
        identifier: "Resources",
        title: "swarm.Resources",
    }
) {}
