import * as Schema from "@effect/schema/Schema";

export class ImagePushOptions extends Schema.Class<ImagePushOptions>("ImagePushOptions")({
    All: Schema.Boolean,
    RegistryAuth: Schema.String,
    Platform: Schema.String,
}) {}
