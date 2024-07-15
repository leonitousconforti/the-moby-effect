import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class zoneTrans extends Schema.Class<zoneTrans>("zoneTrans")(
    {
        when: MobySchemas.Int64,
        index: MobySchemas.UInt8,
        isstd: Schema.Boolean,
        isutc: Schema.Boolean,
    },
    {
        identifier: "zoneTrans",
        title: "time.zoneTrans",
    }
) {}
