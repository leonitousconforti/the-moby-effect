import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class DiskUsage extends Schema.Class<DiskUsage>("DiskUsage")(
    {
        LayersSize: MobySchemas.Int64,
        Images: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ImageSummary))),
        Containers: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerInspectResponse))),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.Volume))),
        BuildCache: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.BuildCache))),
        BuilderSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "DiskUsage",
        title: "types.DiskUsage",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/types.go#L399-L408",
    }
) {}
