import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const ThrottleDevice = S.Struct({
    /** Device path */
    Path: S.optional(S.String),
    /** Rate */
    Rate: S.optional(pipe(S.Number, S.int(), S.greaterThanOrEqualTo(0))),
});

export type ThrottleDevice = S.Schema.Type<typeof ThrottleDevice>;
export const ThrottleDeviceEncoded = S.encodedSchema(ThrottleDevice);
export type ThrottleDeviceEncoded = S.Schema.Encoded<typeof ThrottleDevice>;
