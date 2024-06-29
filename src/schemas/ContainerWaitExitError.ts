import { Schema as S } from "@effect/schema";

/** Container waiting error, if any */
export const ContainerWaitExitError = S.Struct({
    /** Details of an error */
    Message: S.optional(S.String),
});

export type ContainerWaitExitError = S.Schema.Type<typeof ContainerWaitExitError>;
export const ContainerWaitExitErrorEncoded = S.encodedSchema(ContainerWaitExitError);
export type ContainerWaitExitErrorEncoded = S.Schema.Encoded<typeof ContainerWaitExitError>;
