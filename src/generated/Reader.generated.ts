import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Reader extends Schema.Class<Reader>("Reader")(
    {
        buf: Schema.NullOr(Schema.Array(MobySchemas.UInt8)),
        rd: Schema.Object,
        r: Schema.NullOr(MobySchemas.Int64),
        w: Schema.NullOr(MobySchemas.Int64),
        err: Schema.Object,
        lastByte: Schema.NullOr(MobySchemas.Int64),
        lastRuneSize: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "Reader",
        title: "bufio.Reader",
    }
) {}
