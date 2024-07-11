import * as Schema from "@effect/schema/Schema";

export class ImageLoadResponse extends Schema.Class<ImageLoadResponse>("ImageLoadResponse")({
    Body: object,
    JSON: Schema.Boolean,
}) {}
