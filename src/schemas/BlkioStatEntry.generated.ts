import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class BlkioStatEntry extends Schema.Class<BlkioStatEntry>("BlkioStatEntry")({
    Major: MobySchemas.UInt64,
    Minor: MobySchemas.UInt64,
    Op: Schema.String,
    Value: MobySchemas.UInt64,
}) {}
