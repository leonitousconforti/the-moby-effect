import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class PidsStats extends Schema.Class<PidsStats>("PidsStats")({
    Current: MobySchemas.UInt64,
    Limit: MobySchemas.UInt64,
}) {}
