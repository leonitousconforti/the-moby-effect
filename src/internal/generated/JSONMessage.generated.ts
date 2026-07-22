import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as JsonmessageJSONError from "./JsonmessageJSONError.generated.ts";
import * as JsonmessageJSONProgress from "./JsonmessageJSONProgress.generated.ts";

export class JSONMessage extends Schema.Class<JSONMessage>("JSONMessage")(
    {
        stream: Schema.optional(Schema.String),
        status: Schema.optional(Schema.String),
        progressDetail: Schema.optional(Schema.NullOr(JsonmessageJSONProgress.JsonmessageJSONProgress)),
        progress: Schema.optional(Schema.String),
        id: Schema.optional(Schema.String),
        from: Schema.optional(Schema.String),
        time: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        timeNano: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
        errorDetail: Schema.optional(Schema.NullOr(JsonmessageJSONError.JsonmessageJSONError)),
        error: Schema.optional(Schema.String),
        aux: Schema.optional(Schema.NullOr(Schema.Unknown)),
    },
    {
        identifier: "JSONMessage",
        title: "jsonmessage.JSONMessage",
        documentation: "",
    }
) {}
