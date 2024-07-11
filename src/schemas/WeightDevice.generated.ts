import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class WeightDevice extends Schema.Class<WeightDevice>("WeightDevice")({
    Path: Schema.String,
    Weight: MobySchemas.UInt16,
}) {}
