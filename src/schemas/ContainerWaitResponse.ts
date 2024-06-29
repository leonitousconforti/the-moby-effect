import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { ContainerWaitExitError } from "./ContainerWaitExitError.js";

/** OK response to ContainerWait operation */
export const ContainerWaitResponse = S.Struct({
    /** Exit code of the container */
    StatusCode: pipe(S.Number, S.int()),
    Error: S.optional(ContainerWaitExitError),
});

export type ContainerWaitResponse = S.Schema.Type<typeof ContainerWaitResponse>;
export const ContainerWaitResponseEncoded = S.encodedSchema(ContainerWaitResponse);
export type ContainerWaitResponseEncoded = S.Schema.Encoded<typeof ContainerWaitResponse>;
