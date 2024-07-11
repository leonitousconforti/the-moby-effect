import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class UpdateConfig extends Schema.Class<UpdateConfig>("UpdateConfig")({
    Parallelism: MobySchemas.UInt64,
    Delay: MobySchemas.Int64,
    FailureAction: Schema.String,
    Monitor: MobySchemas.Int64,
    MaxFailureRatio: Schema.Number,
    Order: Schema.String,
}) {}
