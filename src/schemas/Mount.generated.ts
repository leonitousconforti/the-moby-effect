import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Mount extends Schema.Class<Mount>("Mount")({
    Type: Schema.String,
    Source: Schema.String,
    Target: Schema.String,
    ReadOnly: Schema.Boolean,
    Consistency: Schema.String,
    BindOptions: MobySchemas.BindOptions,
    VolumeOptions: MobySchemas.VolumeOptions,
    TmpfsOptions: MobySchemas.TmpfsOptions,
    ClusterOptions: MobySchemas.ClusterOptions,
}) {}
