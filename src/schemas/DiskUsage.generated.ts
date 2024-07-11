import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class DiskUsage extends Schema.Class<DiskUsage>("DiskUsage")({
    LayersSize: MobySchemas.Int64,
    Images: Schema.Array(MobySchemas.ImageSummary),
    Containers: Schema.Array(MobySchemas.Container),
    Volumes: Schema.Array(MobySchemas.Volume),
    BuildCache: Schema.Array(MobySchemas.BuildCache),
    BuilderSize: MobySchemas.Int64,
}) {}
