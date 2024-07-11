import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class RestartPolicy extends Schema.Class<RestartPolicy>("RestartPolicy")({
    Condition: Schema.String,
    Delay: MobySchemas.Int64,
    MaxAttempts: MobySchemas.UInt64,
    Window: MobySchemas.Int64,
}) {}
