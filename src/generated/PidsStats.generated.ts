import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PidsStats extends Schema.Class<PidsStats>("PidsStats")(
    {
        current: Schema.optional(MobySchemas.UInt64, { nullable: true }),
        limit: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "PidsStats",
        title: "types.PidsStats",
    }
) {}
