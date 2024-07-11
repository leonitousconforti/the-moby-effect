import * as Schema from "@effect/schema/Schema";

export class ImageImportSource extends Schema.Class<ImageImportSource>("ImageImportSource")({
    Source: object,
    SourceName: Schema.String,
}) {}
