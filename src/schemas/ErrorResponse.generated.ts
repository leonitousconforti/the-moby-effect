import * as Schema from "@effect/schema/Schema";

export class ErrorResponse extends Schema.Class<ErrorResponse>("ErrorResponse")({
    Message: Schema.String,
}) {}