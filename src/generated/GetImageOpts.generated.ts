import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class GetImageOpts extends Schema.Class<GetImageOpts>("GetImageOpts")(
    {
        Platform: Schema.NullOr(MobySchemasGenerated.Platform),
        Details: Schema.NullOr(Schema.Boolean),
    },
    {
        identifier: "GetImageOpts",
        title: "image.GetImageOpts",
    }
) {}
