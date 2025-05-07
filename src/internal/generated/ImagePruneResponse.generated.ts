import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>("ImagePruneResponse")(
    {
        CachesDeleted: Schema.NullOr(Schema.Array(Schema.String)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ImagePruneResponse",
        title: "types.BuildCachePruneReport",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/image.go#L14-L19",
    }
) {}
