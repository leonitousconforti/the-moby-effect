import * as Schema from "effect/Schema";

export class VolumeCapacityRange extends Schema.Class<VolumeCapacityRange>("VolumeCapacityRange")(
    {
        RequiredBytes: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        LimitBytes: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
    },
    {
        identifier: "VolumeCapacityRange",
        title: "volume.CapacityRange",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#CapacityRange",
    }
) {}
