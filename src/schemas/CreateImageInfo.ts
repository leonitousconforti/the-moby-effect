import { Schema as S } from "@effect/schema";

import { ErrorDetail } from "./ErrorDetail.js";
import { ProgressDetail } from "./ProgressDetail.js";

export const CreateImageInfo = S.Struct({
    id: S.optional(S.String),
    error: S.optional(S.String),
    errorDetail: S.optional(ErrorDetail),
    status: S.optional(S.String),
    progress: S.optional(S.String),
    progressDetail: S.optional(ProgressDetail),
});

export type CreateImageInfo = S.Schema.Type<typeof CreateImageInfo>;
export const CreateImageInfoEncoded = S.encodedSchema(CreateImageInfo);
export type CreateImageInfoEncoded = S.Schema.Encoded<typeof CreateImageInfo>;
