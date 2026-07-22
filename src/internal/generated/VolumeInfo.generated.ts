import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as VolumeTopology from "./VolumeTopology.generated.ts";

export class VolumeInfo extends Schema.Class<VolumeInfo>("VolumeInfo")(
    {
        CapacityBytes: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        VolumeContext: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        VolumeID: Schema.optional(Schema.String),
        AccessibleTopology: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)))),
    },
    {
        identifier: "VolumeInfo",
        title: "volume.Info",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Info",
    }
) {}
