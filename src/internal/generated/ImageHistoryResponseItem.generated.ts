import * as Schema from "effect/Schema";

import * as MobyIdentifiers from "../schemas/id.ts";
import * as MobyNumber from "../schemas/number.ts";

export class ImageHistoryResponseItem extends Schema.Class<ImageHistoryResponseItem>("ImageHistoryResponseItem")(
    {
        Comment: Schema.String,
        Created: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        CreatedBy: Schema.String,
        Id: MobyIdentifiers.ImageIdentifier,
        Size: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        Tags: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ImageHistoryResponseItem",
        title: "image.HistoryResponseItem",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#HistoryResponseItem",
    }
) {}
