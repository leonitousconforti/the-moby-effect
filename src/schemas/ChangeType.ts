import { Schema as S } from "@effect/schema";

/**
 * Kind of change
 *
 * Can be one of:
 *
 * - `0`: Modified ("C")
 * - `1`: Added ("A")
 * - `2`: Deleted ("D")
 */
export const ChangeType = S.Literal(0, 1, 2);
export type ChangeType = S.Schema.Type<typeof ChangeType>;
export const ChangeTypeEncoded = S.encodedSchema(ChangeType);
export type ChangeTypeEncoded = S.Schema.Encoded<typeof ChangeType>;
