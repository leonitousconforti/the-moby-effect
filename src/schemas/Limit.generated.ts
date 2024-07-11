import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Limit extends Schema.Class<Limit>("Limit")({
    NanoCPUs: MobySchemas.Int64,
    MemoryBytes: MobySchemas.Int64,
    Pids: MobySchemas.Int64,
}) {}
