import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as BuildCache from "./BuildCache.generated.js";
import * as ContainerListResponseItem from "./ContainerListResponseItem.generated.js";
import * as ImageSummary from "./ImageSummary.generated.js";
import * as Volume from "./Volume.generated.js";

export class DiskUsage extends Schema.Class<DiskUsage>("DiskUsage")(
    {
        LayersSize: MobySchemas.Int64,
        Images: Schema.NullOr(Schema.Array(Schema.NullOr(ImageSummary.ImageSummary))),
        Containers: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerListResponseItem.ContainerListResponseItem))),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(Volume.Volume))),
        BuildCache: Schema.NullOr(Schema.Array(Schema.NullOr(BuildCache.BuildCache))),
        BuilderSize: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "DiskUsage",
        title: "types.DiskUsage",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/types.go#L87-L96",
    }
) {}
