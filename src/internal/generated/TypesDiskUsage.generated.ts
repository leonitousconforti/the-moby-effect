import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as BuildCacheRecord from "./BuildCacheRecord.generated.js";
import * as ContainerSummary from "./ContainerSummary.generated.js";
import * as ImageSummary from "./ImageSummary.generated.js";
import * as VolumeVolume from "./VolumeVolume.generated.js";

export class TypesDiskUsage extends Schema.Class<TypesDiskUsage>("TypesDiskUsage")(
    {
        LayersSize: MobySchemas.Int64,
        Images: Schema.NullOr(Schema.Array(Schema.NullOr(ImageSummary.ImageSummary))),
        Containers: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerSummary.ContainerSummary))),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(VolumeVolume.VolumeVolume))),
        BuildCache: Schema.NullOr(Schema.Array(Schema.NullOr(BuildCacheRecord.BuildCacheRecord))),
        BuilderSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "TypesDiskUsage",
        title: "types.DiskUsage",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#DiskUsage",
    }
) {}
