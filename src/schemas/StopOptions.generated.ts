import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class StopOptions extends Schema.Class<StopOptions>("StopOptions")({
    Signal: Schema.String,
    Timeout: MobySchemas.Int64,
}) {}
