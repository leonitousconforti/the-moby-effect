import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class StopOptions extends Schema.Class<StopOptions>("StopOptions")(
    {
        Signal: Schema.optional(Schema.String, { nullable: true }),
        Timeout: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "StopOptions",
        title: "container.StopOptions",
    }
) {}
