import * as Schema from "@effect/schema/Schema";

export class ImageDeleteResponseItem extends Schema.Class<ImageDeleteResponseItem>("ImageDeleteResponseItem")({
    Deleted: Schema.String,
    Untagged: Schema.String,
}) {}
