import { Schema as S } from "@effect/schema";

/** EngineDescription provides information about an engine. */
export const EngineDescription = S.Struct({
    EngineVersion: S.optional(S.String),
    Labels: S.optional(S.Record(S.String, S.String)),
    Plugins: S.optional(
        S.Array(
            S.Struct({
                Type: S.optional(S.String),
                Name: S.optional(S.String),
            })
        )
    ),
});

export type EngineDescription = S.Schema.Type<typeof EngineDescription>;
export const EngineDescriptionEncoded = S.encodedSchema(EngineDescription);
export type EngineDescriptionEncoded = S.Schema.Encoded<typeof EngineDescription>;
