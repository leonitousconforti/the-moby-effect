import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class VolumeCapacityRange extends Schema.Class<VolumeCapacityRange>("VolumeCapacityRange")(
    {
        RequiredBytes: EffectSchemas.Number.I64,
        LimitBytes: EffectSchemas.Number.I64,
    },
    {
        identifier: "VolumeCapacityRange",
        title: "volume.CapacityRange",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#CapacityRange",
    }
) {}
