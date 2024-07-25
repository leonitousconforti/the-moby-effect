import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>("ImagePruneResponse")(
    {
        CachesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ImagePruneResponse",
        title: "types.BuildCachePruneReport",
    }
) {}
