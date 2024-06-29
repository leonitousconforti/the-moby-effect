import { Schema as S } from "@effect/schema";

/** IndexInfo contains information about a registry. */
export const IndexInfo = S.Struct({
    /** Name of the registry, such as "docker.io". */
    Name: S.optional(S.String),
    /** List of mirrors, expressed as URIs. */
    Mirrors: S.optional(S.Array(S.String)),
    /**
     * Indicates if the registry is part of the list of insecure registries.
     *
     * If `false`, the registry is insecure. Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication.> **Warning**: Insecure registries can be
     * useful when running a local registry. However, because> Its use creates
     * security vulnerabilities it should ONLY be enabled for> Testing purposes.
     * For increased security, users should add their CA to> Their system's list
     * of trusted CAs instead of enabling this option.
     */
    Secure: S.optional(S.Boolean),
    /**
     * Indicates whether this is an official registry (i.e., Docker Hub /
     * docker.io)
     */
    Official: S.optional(S.Boolean),
});

export type IndexInfo = S.Schema.Type<typeof IndexInfo>;
export const IndexInfoEncoded = S.encodedSchema(IndexInfo);
export type IndexInfoEncoded = S.Schema.Encoded<typeof IndexInfo>;
