import * as Schema from "@effect/schema/Schema";

export class ImageRemoveOptions extends Schema.Class<ImageRemoveOptions>("ImageRemoveOptions")({
    Force: Schema.Boolean,
    PruneChildren: Schema.Boolean,
}) {}
