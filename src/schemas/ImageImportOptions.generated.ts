import * as Schema from "@effect/schema/Schema";

export class ImageImportOptions extends Schema.Class<ImageImportOptions>("ImageImportOptions")({
    Tag: Schema.String,
    Message: Schema.String,
    Changes: Schema.Array(Schema.String),
    Platform: Schema.String,
}) {}
