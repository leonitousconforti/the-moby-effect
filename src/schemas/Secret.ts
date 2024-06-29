import { Schema as S } from "@effect/schema";

import { ObjectVersion } from "./ObjectVersion.js";
import { SecretSpec } from "./SecretSpec.js";

export const Secret = S.Struct({
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(SecretSpec),
});

export type Secret = S.Schema.Type<typeof Secret>;
export const SecretEncoded = S.encodedSchema(Secret);
export type SecretEncoded = S.Schema.Encoded<typeof Secret>;
