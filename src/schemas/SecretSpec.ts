import { Schema as S } from "@effect/schema";

import { Driver } from "./Driver.js";

export const SecretSpec = S.Struct({
    /** User-defined name of the secret. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) data to store as
     * secret.
     *
     * This field is only used to _create_ a secret, and is not returned by
     * other endpoints.
     */
    Data: S.optional(S.String),
    Driver: S.optional(Driver),
    Templating: S.optional(Driver),
});

export type SecretSpec = S.Schema.Type<typeof SecretSpec>;
export const SecretSpecEncoded = S.encodedSchema(SecretSpec);
export type SecretSpecEncoded = S.Schema.Encoded<typeof SecretSpec>;
