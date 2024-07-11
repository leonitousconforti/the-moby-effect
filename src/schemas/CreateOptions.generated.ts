import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class CreateOptions extends Schema.Class<CreateOptions>("CreateOptions")({
    ClusterVolumeSpec: MobySchemas.ClusterVolumeSpec,
    Driver: Schema.String,
    DriverOpts: Schema.Record(Schema.String, Schema.String),
    Labels: Schema.Record(Schema.String, Schema.String),
    Name: Schema.String,
}) {}
