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
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/volume/list_response.go#L6-L18",
    }
) {}
