import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Descriptor extends Schema.Class<Descriptor>("Descriptor")(
    {
        MediaType: Schema.String,
        Digest: Schema.String,
        Size: Schema.NullOr(MobySchemas.Int64),
        URLs: Schema.Array(Schema.String),
        Annotations: Schema.Record(Schema.String, Schema.String),
        Data: Schema.Array(MobySchemas.UInt8),
        Platform: Schema.NullOr(MobySchemasGenerated.Platform),
        ArtifactType: Schema.String,
    },
    {
        identifier: "Descriptor",
        title: "v1.Descriptor",
    }
) {}
