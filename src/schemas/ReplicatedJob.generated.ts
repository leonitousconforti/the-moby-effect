import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ReplicatedJob extends Schema.Class<ReplicatedJob>("ReplicatedJob")({
    MaxConcurrent: MobySchemas.UInt64,
    TotalCompletions: MobySchemas.UInt64,
}) {}
