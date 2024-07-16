import * as Schema from "@effect/schema/Schema";

export class ErrorResponse extends Schema.Class<ErrorResponse>("ErrorResponse")(
    {
        message: Schema.String,
    },
    {
        identifier: "ErrorResponse",
        title: "types.ErrorResponse",
    }
) {}
