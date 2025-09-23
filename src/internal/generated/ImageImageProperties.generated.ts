import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as V1Platform from "./V1Platform.generated.js";

export class ImageImageProperties extends Schema.Class<ImageImageProperties>("ImageImageProperties")(
    {
        Platform: Schema.NullOr(V1Platform.V1Platform),
        Size: Schema.Struct({
            Unpacked: MobySchemas.Int64,
        }),
        Containers: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ImageImageProperties",
        title: "image.ImageProperties",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#ImageProperties",
    }
) {}
