import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImagesPruneReport extends Schema.Class<ImagesPruneReport>("ImagesPruneReport")(
    {
        ImagesDeleted: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImageDeleteResponseItem)),
        SpaceReclaimed: Schema.NullOr(MobySchemas.UInt64),
    },
    {
        identifier: "ImagesPruneReport",
        title: "types.ImagesPruneReport",
    }
) {}
