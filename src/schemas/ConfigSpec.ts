import { Schema as S } from "@effect/schema";

import { Driver } from "./Driver.js";

export const ConfigSpec = S.Struct({
    /** User-defined name of the config. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /**
     * Base64-url-safe-encoded ([RFC
     * 4648](https://tools.ietf.org/html/rfc4648#section-5)) config data.
     */
    Data: S.optional(S.String),
    Templating: S.optional(Driver),
});

export type ConfigSpec = S.Schema.Type<typeof ConfigSpec>;
export const ConfigSpecEncoded = S.encodedSchema(ConfigSpec);
export type ConfigSpecEncoded = S.Schema.Encoded<typeof ConfigSpec>;
