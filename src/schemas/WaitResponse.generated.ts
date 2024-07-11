import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class WaitResponse extends Schema.Class<WaitResponse>("WaitResponse")({
    Error: MobySchemas.WaitExitError,
    StatusCode: MobySchemas.Int64,
}) {}
