import * as Schema from "effect/Schema";

import * as MobyIdentifiers from "../schemas/id.ts";
import * as MobyNumber from "../schemas/number.ts";
import * as V1Platform from "./V1Platform.generated.ts";

export class V1Descriptor extends Schema.Class<V1Descriptor>("V1Descriptor")(
    {
        mediaType: Schema.String,
        digest: MobyIdentifiers.Digest,
        size: MobyNumber.BigIntFromWireString.check(
            Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
        ),
        urls: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        annotations: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        data: Schema.optional(Schema.NullOr(Schema.Uint8ArrayFromBase64)),
        platform: Schema.optional(Schema.NullOr(V1Platform.V1Platform)),
        artifactType: Schema.optional(Schema.String),
    },
    {
        identifier: "V1Descriptor",
        title: "v1.Descriptor",
        documentation: "",
    }
) {}
