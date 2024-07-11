import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DispatcherConfig extends Schema.Class<DispatcherConfig>("DispatcherConfig")({
    HeartbeatPeriod: MobySchemas.Int64,
}) {}
