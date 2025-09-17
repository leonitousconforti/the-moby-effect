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
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#ImageProperties",
    }
) {}
