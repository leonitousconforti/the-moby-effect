import { Schema as S } from "@effect/schema";

/** Image ID or Digest */
export const ImageID = S.Struct({
    ID: S.optional(S.String),
});

export type ImageID = S.Schema.Type<typeof ImageID>;
export const ImageIDEncoded = S.encodedSchema(ImageID);
export type ImageIDEncoded = S.Schema.Encoded<typeof ImageID>;
