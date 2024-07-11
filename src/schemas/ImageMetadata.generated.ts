import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ImageMetadata extends Schema.Class<ImageMetadata>("ImageMetadata")({
    LastTagTime: MobySchemas.Time,
}) {}
