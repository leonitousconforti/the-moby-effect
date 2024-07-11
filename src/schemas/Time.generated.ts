import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Time extends Schema.Class<Time>("Time")({
    wall: MobySchemas.UInt64,
    ext: MobySchemas.Int64,
    loc: MobySchemas.Location,
}) {}
