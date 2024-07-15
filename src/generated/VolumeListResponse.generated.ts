import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class VolumeListResponse extends Schema.Class<VolumeListResponse>("ListResponse")(
    {
        Volumes: Schema.NullOr(Schema.Array(MobySchemasGenerated.Volume)),
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ListResponse",
        title: "volume.ListResponse",
    }
) {}
