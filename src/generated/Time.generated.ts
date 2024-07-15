import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Time extends Schema.Class<Time>("Time")(
    {
        wall: MobySchemas.UInt64,
        ext: MobySchemas.Int64,
        loc: Schema.NullOr(MobySchemasGenerated.Location),
    },
    {
        identifier: "Time",
        title: "time.Time",
    }
) {}
