import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class Descriptor extends Schema.Class<Descriptor>("Descriptor")(
    {
        mediaType: Schema.NullOr(Schema.String),
        digest: Schema.NullOr(Schema.String),
        size: Schema.NullOr(MobySchemas.Int64),
        urls: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        annotations: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        data: Schema.optional(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        platform: Schema.optional(MobySchemasGenerated.Platform, { nullable: true }),
        artifactType: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "Descriptor",
        title: "v1.Descriptor",
    }
) {}
