import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Reader extends Schema.Class<Reader>("Reader")({
    buf: Schema.Array(MobySchemas.UInt8),
    rd: object,
    r: MobySchemas.Int64,
    w: MobySchemas.Int64,
    err: object,
    lastByte: MobySchemas.Int64,
    lastRuneSize: MobySchemas.Int64,
}) {}
