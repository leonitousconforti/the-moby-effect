import * as Schema from "effect/Schema";
import * as Volume from "./Volume.generated.js";

export class VolumeListResponse extends Schema.Class<VolumeListResponse>("VolumeListResponse")(
    {
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(Volume.Volume))),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "VolumeListResponse",
        title: "volume.ListResponse",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/volume#ListResponse",
    }
) {}
