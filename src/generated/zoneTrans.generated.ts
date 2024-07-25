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
        documentation:
            "https://github.com/golang/go/blob/3959d54c0bd5c92fe0a5e33fedb0595723efc23b/src/time/zoneinfo.go#L56-L61",
    }
) {}
