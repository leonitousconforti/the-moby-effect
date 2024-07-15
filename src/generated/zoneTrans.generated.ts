import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class zoneTrans extends Schema.Class<zoneTrans>("zoneTrans")(
    {
        when: Schema.NullOr(MobySchemas.Int64),
        index: Schema.NullOr(MobySchemas.UInt8),
        isstd: Schema.NullOr(Schema.Boolean),
        isutc: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "zoneTrans",
        title: "time.zoneTrans",
    }
) {}
