import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class DiskUsage extends Schema.Class<DiskUsage>("DiskUsage")(
    {
        LayersSize: MobySchemas.Int64,
        Images: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImagesListResponse)),
        Containers: Schema.NullOr(Schema.Array(MobySchemasGenerated.ContainerListResponse)),
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.Volume)),
        BuildCache: Schema.NullOr(Schema.Array(MobySchemasGenerated.BuildCache)),
        BuilderSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "DiskUsage",
        title: "types.DiskUsage",
    }
) {}
