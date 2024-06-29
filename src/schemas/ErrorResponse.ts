import { Schema as S } from "@effect/schema";

/** Represents an error. */
export const ErrorResponse = S.Struct({
    /** The error message. */
    message: S.String,
});

export type ErrorResponse = S.Schema.Type<typeof ErrorResponse>;
export const ErrorResponseEncoded = S.encodedSchema(ErrorResponse);
export type ErrorResponseEncoded = S.Schema.Encoded<typeof ErrorResponse>;
