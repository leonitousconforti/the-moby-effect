import { Schema as S } from "@effect/schema";

import { ErrorDetail } from "./ErrorDetail.js";
import { ImageID } from "./ImageID.js";
import { ProgressDetail } from "./ProgressDetail.js";

export const BuildInfo = S.Struct({
    id: S.optional(S.String),
    stream: S.optional(S.String),
    error: S.optional(S.String),
    errorDetail: S.optional(ErrorDetail),
    status: S.optional(S.String),
    progress: S.optional(S.String),
    progressDetail: S.optional(ProgressDetail),
    aux: S.optional(ImageID),
});

export type BuildInfo = S.Schema.Type<typeof BuildInfo>;
export const BuildInfoEncoded = S.encodedSchema(BuildInfo);
export type BuildInfoEncoded = S.Schema.Encoded<typeof BuildInfo>;
