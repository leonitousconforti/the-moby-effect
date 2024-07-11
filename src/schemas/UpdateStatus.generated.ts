import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class UpdateStatus extends Schema.Class<UpdateStatus>("UpdateStatus")({
    State: Schema.String,
    StartedAt: MobySchemas.Time,
    CompletedAt: MobySchemas.Time,
    Message: Schema.String,
}) {}
