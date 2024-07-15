import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ResizeOptions extends Schema.Class<ResizeOptions>("ResizeOptions")(
    {
        Height: Schema.NullOr(MobySchemas.UInt64),
        Width: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ResizeOptions",
        title: "types.ResizeOptions",
    }
) {}
