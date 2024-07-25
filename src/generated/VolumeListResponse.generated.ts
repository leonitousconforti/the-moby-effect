import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeListResponse extends Schema.Class<VolumeListResponse>("VolumeListResponse")(
    {
        Volumes: Schema.NullOr(Schema.Array(Schema.NullOr(MobySchemasGenerated.Volume))),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "VolumeListResponse",
        title: "volume.ListResponse",
    }
) {}
