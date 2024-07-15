import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class DiskUsage extends Schema.Class<DiskUsage>("DiskUsage")(
    {
        LayersSize: Schema.NullOr(MobySchemas.Int64),
        Images: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImageSummary)),
        Containers: Schema.NullOr(Schema.Array(MobySchemasGenerated.Container)),
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.Volume)),
        BuildCache: Schema.NullOr(Schema.Array(MobySchemasGenerated.BuildCache)),
        BuilderSize: Schema.optional(MobySchemas.Int64, { nullable: true }),
    },
    {
        identifier: "DiskUsage",
        title: "types.DiskUsage",
    }
) {}
