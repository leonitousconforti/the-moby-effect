import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class BlkioStatEntry extends Schema.Class<BlkioStatEntry>("BlkioStatEntry")(
    {
        major: Schema.NullOr(MobySchemas.UInt64),
        minor: Schema.NullOr(MobySchemas.UInt64),
        op: Schema.NullOr(Schema.String),
        value: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "BlkioStatEntry",
        title: "types.BlkioStatEntry",
    }
) {}
