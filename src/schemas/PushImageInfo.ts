import { Schema as S } from "@effect/schema";

import { ProgressDetail } from "./ProgressDetail.js";

export const PushImageInfo = S.Struct({
    error: S.optional(S.String),
    status: S.optional(S.String),
    progress: S.optional(S.String),
    progressDetail: S.optional(ProgressDetail),
});

export type PushImageInfo = S.Schema.Type<typeof PushImageInfo>;
export const PushImageInfoEncoded = S.encodedSchema(PushImageInfo);
export type PushImageInfoEncoded = S.Schema.Encoded<typeof PushImageInfo>;
