import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ImagesPruneReport extends Schema.Class<ImagesPruneReport>("ImagesPruneReport")({
    ImagesDeleted: Schema.Array(MobySchemas.ImageDeleteResponseItem),
    SpaceReclaimed: MobySchemas.UInt64,
}) {}
