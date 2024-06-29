import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** Represents the status of a container. */
export const ContainerStatus = S.Struct({
    ContainerID: S.optional(S.String),
    PID: S.optional(pipe(S.Number, S.int())),
    ExitCode: S.optional(pipe(S.Number, S.int())),
});

export type ContainerStatus = S.Schema.Type<typeof ContainerStatus>;
export const ContainerStatusEncoded = S.encodedSchema(ContainerStatus);
export type ContainerStatusEncoded = S.Schema.Encoded<typeof ContainerStatus>;
