import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const ProgressDetail = S.Struct({
    current: S.optional(pipe(S.Number, S.int())),
    total: S.optional(pipe(S.Number, S.int())),
});

export type ProgressDetail = S.Schema.Type<typeof ProgressDetail>;
export const ProgressDetailEncoded = S.encodedSchema(ProgressDetail);
export type ProgressDetailEncoded = S.Schema.Encoded<typeof ProgressDetail>;
