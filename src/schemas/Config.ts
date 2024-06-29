import { Schema as S } from "@effect/schema";

import { ConfigSpec } from "./ConfigSpec.js";
import { ObjectVersion } from "./ObjectVersion.js";

export const Config = S.Struct({
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    Spec: S.optional(ConfigSpec),
});

export type Config = S.Schema.Type<typeof Config>;
export const ConfigEncoded = S.encodedSchema(Config);
export type ConfigEncoded = S.Schema.Encoded<typeof Config>;
