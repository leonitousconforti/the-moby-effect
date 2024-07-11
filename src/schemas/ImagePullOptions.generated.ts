import * as Schema from "@effect/schema/Schema";

export class ImagePullOptions extends Schema.Class<ImagePullOptions>("ImagePullOptions")({
    All: Schema.Boolean,
    RegistryAuth: Schema.String,
    Platform: Schema.String,
}) {}
