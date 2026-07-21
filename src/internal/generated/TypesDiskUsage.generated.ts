import * as Schema from "effect/Schema";

import * as BuildCacheRecord from "./BuildCacheRecord.generated.ts";
import * as ContainerSummary from "./ContainerSummary.generated.ts";
import * as ImageSummary from "./ImageSummary.generated.ts";
import * as VolumeVolume from "./VolumeVolume.generated.ts";

export class TypesDiskUsage extends Schema.Class<TypesDiskUsage>("TypesDiskUsage")(
    {
        LayersSize: Schema.BigIntFromString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        Images: Schema.NullOr(Schema.Array(Schema.NullOr(ImageSummary.ImageSummary))),
        Containers: Schema.NullOr(Schema.Array(Schema.NullOr(ContainerSummary.ContainerSummary))),
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(VolumeVolume.VolumeVolume))),
        BuildCache: Schema.NullOr(Schema.Array(Schema.NullOr(BuildCacheRecord.BuildCacheRecord))),
        BuilderSize: Schema.optional(
            Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))
        ),
    },
    {
        identifier: "TypesDiskUsage",
        title: "types.DiskUsage",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types#DiskUsage",
    }
) {}
