import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Resources extends Schema.Class<Resources>("Resources")({
    NanoCPUs: MobySchemas.Int64,
    MemoryBytes: MobySchemas.Int64,
    GenericResources: Schema.Array(MobySchemas.GenericResource),
}) {}
