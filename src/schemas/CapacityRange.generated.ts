import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class CapacityRange extends Schema.Class<CapacityRange>("CapacityRange")({
    RequiredBytes: MobySchemas.Int64,
    LimitBytes: MobySchemas.Int64,
}) {}
