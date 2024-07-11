import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class NetIPNet extends Schema.Class<NetIPNet>("NetIPNet")({
    IP: Schema.Array(MobySchemas.UInt8),
    Mask: Schema.Array(MobySchemas.UInt8),
}) {}
