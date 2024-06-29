import { Schema as S } from "@effect/schema";

import { ChangeType } from "./ChangeType.js";

/** Change in the container's filesystem. */
export const FilesystemChange = S.Struct({
    /** Path to file or directory that has changed. */
    Path: S.String,
    Kind: ChangeType,
});

export type FilesystemChange = S.Schema.Type<typeof FilesystemChange>;
export const FilesystemChangeEncoded = S.encodedSchema(FilesystemChange);
export type FilesystemChangeEncoded = S.Schema.Encoded<typeof FilesystemChange>;
