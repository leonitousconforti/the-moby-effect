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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/volume/list_response.go#L6-L18",
    }
) {}
