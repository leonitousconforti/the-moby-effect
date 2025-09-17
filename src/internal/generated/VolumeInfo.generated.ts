import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as VolumeTopology from "./VolumeTopology.generated.js";

export class VolumeInfo extends Schema.Class<VolumeInfo>("VolumeInfo")(
    {
        CapacityBytes: Schema.optional(MobySchemas.Int64),
        VolumeContext: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), {
            nullable: true,
        }),
        VolumeID: Schema.optional(Schema.String),
        AccessibleTopology: Schema.optionalWith(Schema.Array(Schema.NullOr(VolumeTopology.VolumeTopology)), {
            nullable: true,
        }),
    },
    {
        identifier: "VolumeInfo",
        title: "volume.Info",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#Info",
    }
) {}
