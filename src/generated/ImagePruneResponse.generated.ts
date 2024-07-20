import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImagePruneResponse extends Schema.Class<ImagePruneResponse>("ImagePruneResponse")(
    {
        ImagesDeleted: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImageDeleteResponse)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ImagePruneResponse",
        title: "image.PruneReport",
    }
) {}
