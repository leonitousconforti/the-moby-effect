import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class UsageData extends Schema.Class<UsageData>("UsageData")({
    RefCount: MobySchemas.Int64,
    Size: MobySchemas.Int64,
}) {}
