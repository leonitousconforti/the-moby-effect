import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>("ImagePruneResponse")(
    {
        CachesDeleted: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ImagePruneResponse",
        title: "types.BuildCachePruneReport",
        documentation:
            "https://github.com/moby/moby/blob/2b1097f08088fd387a01c6d6a2a0f6916a39b872/api/types/image/image.go#L14-L19",
    }
) {}
