import { Schema as S } from "@effect/schema";

/**
 * Information about the issuer of leaf TLS certificates and the trusted root CA
 * certificate.
 */
export const TLSInfo = S.Struct({
    /**
     * The root CA certificate(s) that are used to validate leaf TLS
     * certificates.
     */
    TrustRoot: S.optional(S.String),
    /** The base64-url-safe-encoded raw subject bytes of the issuer. */
    CertIssuerSubject: S.optional(S.String),
    /** The base64-url-safe-encoded raw public key bytes of the issuer. */
    CertIssuerPublicKey: S.optional(S.String),
});

export type TLSInfo = S.Schema.Type<typeof TLSInfo>;
export const TLSInfoEncoded = S.encodedSchema(TLSInfo);
export type TLSInfoEncoded = S.Schema.Encoded<typeof TLSInfo>;
