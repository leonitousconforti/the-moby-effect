import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class VolumeOptions extends Schema.Class<VolumeOptions>("VolumeOptions")({
    NoCopy: Schema.Boolean,
    Labels: Schema.Record(Schema.String, Schema.String),
    DriverConfig: MobySchemas.Driver,
}) {}
