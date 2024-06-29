import { Schema as S } from "@effect/schema";

/** OK response to ContainerCreate operation */
export const ContainerCreateResponse = S.Struct({
    /** The ID of the created container */
    Id: S.String,
    /** Warnings encountered when creating the container */
    Warnings: S.Array(S.String),
});

export type ContainerCreateResponse = S.Schema.Type<typeof ContainerCreateResponse>;
export const ContainerCreateResponseEncoded = S.encodedSchema(ContainerCreateResponse);
export type ContainerCreateResponseEncoded = S.Schema.Encoded<typeof ContainerCreateResponse>;
