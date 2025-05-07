import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Platform from "./Platform.generated.js";

export class ImageProperties extends Schema.Class<ImageProperties>("ImageProperties")(
    {
        Platform: Schema.NullOr(Platform.Platform),
        Size: Schema.Struct({
            Unpacked: MobySchemas.Int64,
        }),
        Containers: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ImageProperties",
        title: "image.ImageProperties",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/manifest.go#L70-L94",
    }
) {}
