import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";

export class VolumeUsageData extends Schema.Class<VolumeUsageData>("VolumeUsageData")(
    {
        RefCount: EffectSchemas.Number.I64,
        Size: EffectSchemas.Number.I64,
    },
    {
        identifier: "VolumeUsageData",
        title: "volume.UsageData",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#UsageData",
    }
) {}
