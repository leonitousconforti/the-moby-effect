import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/**
 * User-defined resources can be either Integer resources (e.g, `SSD=3`) or
 * String resources (e.g, `GPU=UUID1`).
 */
export const GenericResources = S.Array(
    S.Struct({
        NamedResourceSpec: S.optional(
            S.Struct({
                Kind: S.optional(S.String),
                Value: S.optional(S.String),
            })
        ),
        DiscreteResourceSpec: S.optional(
            S.Struct({
                Kind: S.optional(S.String),
                Value: S.optional(pipe(S.Number, S.int())),
            })
        ),
    })
);

export type GenericResources = S.Schema.Type<typeof GenericResources>;
export const GenericResourcesEncoded = S.encodedSchema(GenericResources);
export type GenericResourcesEncoded = S.Schema.Encoded<typeof GenericResources>;
