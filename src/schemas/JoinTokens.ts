import { Schema as S } from "@effect/schema";

/** JoinTokens contains the tokens workers and managers need to join the swarm. */
export const JoinTokens = S.Struct({
    /** The token workers can use to join the swarm. */
    Worker: S.optional(S.String),
    /** The token managers can use to join the swarm. */
    Manager: S.optional(S.String),
});

export type JoinTokens = S.Schema.Type<typeof JoinTokens>;
export const JoinTokensEncoded = S.encodedSchema(JoinTokens);
export type JoinTokensEncoded = S.Schema.Encoded<typeof JoinTokens>;
