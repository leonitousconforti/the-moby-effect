import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class UsageData extends Schema.Class<UsageData>("UsageData")(
    {
        RefCount: Schema.NullOr(MobySchemas.Int64),
        Size: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "UsageData",
        title: "volume.UsageData",
    }
) {}
