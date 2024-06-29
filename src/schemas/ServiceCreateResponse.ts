import { Schema as S } from "@effect/schema";

/**
 * Contains the information returned to a client on the creation of a new
 * service.
 */
export const ServiceCreateResponse = S.Struct({
    /** The ID of the created service. */
    ID: S.optional(S.String),
    /**
     * Optional warning message.
     *
     * FIXME(thaJeztah): this should have "omitempty" in the generated type.
     */
    Warnings: S.optional(S.Array(S.String)),
});

export type ServiceCreateResponse = S.Schema.Type<typeof ServiceCreateResponse>;
export const ServiceCreateResponseEncoded = S.encodedSchema(ServiceCreateResponse);
export type ServiceCreateResponseEncoded = S.Schema.Encoded<typeof ServiceCreateResponse>;
