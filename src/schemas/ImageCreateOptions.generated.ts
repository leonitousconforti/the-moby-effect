import * as Schema from "@effect/schema/Schema";

export class ImageCreateOptions extends Schema.Class<ImageCreateOptions>("ImageCreateOptions")({
    RegistryAuth: Schema.String,
    Platform: Schema.String,
}) {}
