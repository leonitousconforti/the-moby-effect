import * as Schema from "effect/Schema";

export class VolumeUsageData extends Schema.Class<VolumeUsageData>("VolumeUsageData")(
    {
        RefCount: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        Size: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "VolumeUsageData",
        title: "volume.UsageData",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#UsageData",
    }
) {}
