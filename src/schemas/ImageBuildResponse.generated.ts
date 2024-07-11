import * as Schema from "@effect/schema/Schema";

export class ImageBuildResponse extends Schema.Class<ImageBuildResponse>("ImageBuildResponse")({
    Body: object,
    OSType: Schema.String,
}) {}
