import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImagesPruneResponse extends Schema.Class<ImagesPruneResponse>("ImagesPruneResponse")(
    {
        ImagesDeleted: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImageDeleteResponse)),
        SpaceReclaimed: MobySchemas.UInt64,
    },
    {
        identifier: "ImagesPruneResponse",
        title: "types.ImagesPruneReport",
    }
) {}
