import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Descriptor extends Schema.Class<Descriptor>("Descriptor")({
    MediaType: Schema.String,
    Digest: Schema.String,
    Size: MobySchemas.Int64,
    URLs: Schema.Array(Schema.String),
    Annotations: Schema.Record(Schema.String, Schema.String),
    Data: Schema.Array(MobySchemas.UInt8),
    Platform: MobySchemas.Platform,
    ArtifactType: Schema.String,
}) {}
