import * as Schema from "effect/Schema";

import * as V1Platform from "./V1Platform.generated.ts";

export class ImageImageProperties extends Schema.Class<ImageImageProperties>("ImageImageProperties")(
    {
        Platform: Schema.NullOr(V1Platform.V1Platform),
        Size: Schema.Struct({
            Unpacked: Schema.BigIntFromString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            ),
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
