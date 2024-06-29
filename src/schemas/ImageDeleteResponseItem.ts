import { Schema as S } from "@effect/schema";

export const ImageDeleteResponseItem = S.Struct({
    /** The image ID of an image that was untagged */
    Untagged: S.optional(S.String),
    /** The image ID of an image that was deleted */
    Deleted: S.optional(S.String),
});

export type ImageDeleteResponseItem = S.Schema.Type<typeof ImageDeleteResponseItem>;
export const ImageDeleteResponseItemEncoded = S.encodedSchema(ImageDeleteResponseItem);
export type ImageDeleteResponseItemEncoded = S.Schema.Encoded<typeof ImageDeleteResponseItem>;
