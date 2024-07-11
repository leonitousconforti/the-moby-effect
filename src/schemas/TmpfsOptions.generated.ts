import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class TmpfsOptions extends Schema.Class<TmpfsOptions>("TmpfsOptions")({
    SizeBytes: MobySchemas.Int64,
    Mode: MobySchemas.UInt32,
}) {}
