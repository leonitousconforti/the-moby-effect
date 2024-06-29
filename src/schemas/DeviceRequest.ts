import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** A request for devices to be sent to device drivers */
export const DeviceRequest = S.Struct({
    Driver: S.optional(S.String),
    Count: S.optional(pipe(S.Number, S.int())),
    DeviceIDs: S.optional(S.Array(S.String)),
    /** A list of capabilities; an OR list of AND lists of capabilities. */
    Capabilities: S.optional(S.Array(S.Array(S.String))),
    /**
     * Driver-specific options, specified as a key/value pairs. These options
     * are passed directly to the driver.
     */
    Options: S.optional(S.Record(S.String, S.String)),
});

export type DeviceRequest = S.Schema.Type<typeof DeviceRequest>;
export const DeviceRequestEncoded = S.encodedSchema(DeviceRequest);
export type DeviceRequestEncoded = S.Schema.Encoded<typeof DeviceRequest>;
