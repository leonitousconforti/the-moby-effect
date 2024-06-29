import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const ErrorDetail = S.Struct({
    code: S.optional(pipe(S.Number, S.int())),
    message: S.optional(S.String),
});

export type ErrorDetail = S.Schema.Type<typeof ErrorDetail>;
export const ErrorDetailEncoded = S.encodedSchema(ErrorDetail);
export type ErrorDetailEncoded = S.Schema.Encoded<typeof ErrorDetail>;
