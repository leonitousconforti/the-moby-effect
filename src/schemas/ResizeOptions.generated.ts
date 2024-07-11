import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ResizeOptions extends Schema.Class<ResizeOptions>("ResizeOptions")({
    Height: MobySchemas.UInt64,
    Width: MobySchemas.UInt64,
}) {}
