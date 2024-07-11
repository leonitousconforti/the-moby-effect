import * as Schema from "@effect/schema/Schema";

export class VolumeAttachment extends Schema.Class<VolumeAttachment>("VolumeAttachment")({
    ID: Schema.String,
    Source: Schema.String,
    Target: Schema.String,
}) {}
