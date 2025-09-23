import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as V1Platform from "./V1Platform.generated.js";

export class V1Descriptor extends Schema.Class<V1Descriptor>("V1Descriptor")(
    {
        mediaType: Schema.String,
        digest: MobySchemas.Digest,
        size: MobySchemas.Int64,
        urls: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        annotations: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        data: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        platform: Schema.optionalWith(V1Platform.V1Platform, { nullable: true }),
        artifactType: Schema.optional(Schema.String),
    },
    {
        identifier: "V1Descriptor",
        title: "v1.Descriptor",
        documentation: "",
    }
) {}
