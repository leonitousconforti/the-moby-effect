import { Schema as S } from "@effect/schema";

/** Response to an API call that returns just an Id */
export const IdResponse = S.Struct({
    /** The id of the newly created object. */
    Id: S.String,
});

export type IdResponse = S.Schema.Type<typeof IdResponse>;
export const IdResponseEncoded = S.encodedSchema(IdResponse);
export type IdResponseEncoded = S.Schema.Encoded<typeof IdResponse>;
