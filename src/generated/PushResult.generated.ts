import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class PushResult extends Schema.Class<PushResult>("PushResult")(
    {
        Tag: Schema.NullOr(Schema.String),
        Digest: Schema.NullOr(Schema.String),
        Size: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "PushResult",
        title: "types.PushResult",
    }
) {}
