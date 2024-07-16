import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BlkioStatEntry extends Schema.Class<BlkioStatEntry>("BlkioStatEntry")(
    {
        major: MobySchemas.UInt64,
        minor: MobySchemas.UInt64,
        op: Schema.String,
        value: MobySchemas.UInt64,
    },
    {
        identifier: "BlkioStatEntry",
        title: "types.BlkioStatEntry",
    }
) {}
