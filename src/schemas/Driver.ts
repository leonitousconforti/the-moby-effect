import { Schema as S } from "@effect/schema";

/** Driver represents a driver (network, logging, secrets). */
export const Driver = S.Struct({
    /** Name of the driver. */
    Name: S.String,
    /** Key/value map of driver-specific options. */
    Options: S.optional(S.Record(S.String, S.String)),
});

export type Driver = S.Schema.Type<typeof Driver>;
export const DriverEncoded = S.encodedSchema(Driver);
export type DriverEncoded = S.Schema.Encoded<typeof Driver>;
