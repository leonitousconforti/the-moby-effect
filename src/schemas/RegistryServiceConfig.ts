import { Schema as S } from "@effect/schema";

import { IndexInfo } from "./IndexInfo.js";

/** RegistryServiceConfig stores daemon registry services configuration. */
export const RegistryServiceConfig = S.Struct({
    /**
     * List of IP ranges to which nondistributable artifacts can be pushed,
     * using the CIDR syntax [RFC 4632](https://tools.ietf.org/html/4632).
     *
     * Some images (for example, Windows base images) contain artifacts whose
     * distribution is restricted by license. When these images are pushed to a
     * registry, restricted artifacts are not included.
     *
     * This configuration override this behavior, and enables the daemon to push
     * nondistributable artifacts to all registries whose resolved IP address is
     * within the subnet described by the CIDR syntax.
     *
     * This option is useful when pushing images containing nondistributable
     * artifacts to a registry on an air-gapped network so hosts on that network
     * can pull the images without connecting to another server.> **Warning**:
     * Nondistributable artifacts typically have restrictions on how and where
     * they can> Be distributed and shared. Only use this feature to push
     * artifacts to> Private registries and ensure that you are in compliance
     * with any terms> That cover redistributing nondistributable artifacts.
     */
    AllowNondistributableArtifactsCIDRs: S.optional(S.Array(S.String)),
    /**
     * List of registry hostnames to which nondistributable artifacts can be
     * pushed, using the format `<hostname>[:<port>]` or `<IP
     * address>[:<port>]`.
     *
     * Some images (for example, Windows base images) contain artifacts whose
     * distribution is restricted by license. When these images are pushed to a
     * registry, restricted artifacts are not included.
     *
     * This configuration override this behavior for the specified registries.
     *
     * This option is useful when pushing images containing nondistributable
     * artifacts to a registry on an air-gapped network so hosts on that network
     * can pull the images without connecting to another server.> **Warning**:
     * Nondistributable artifacts typically have restrictions on how and where
     * they can> Be distributed and shared. Only use this feature to push
     * artifacts to> Private registries and ensure that you are in compliance
     * with any terms> That cover redistributing nondistributable artifacts.
     */
    AllowNondistributableArtifactsHostnames: S.optional(S.Array(S.String)),
    /**
     * List of IP ranges of insecure registries, using the CIDR syntax ([RFC
     * 4632](https://tools.ietf.org/html/4632)). Insecure registries accept
     * un-encrypted (HTTP) and/or untrusted (HTTPS with certificates from
     * unknown CAs) communication.
     *
     * By default, local registries (`127.0.0.0/8`) are configured as insecure.
     * All other registries are secure. Communicating with an insecure registry
     * is not possible if the daemon assumes that registry is secure.
     *
     * This configuration override this behavior, insecure communication with
     * registries whose resolved IP address is within the subnet described by
     * the CIDR syntax.
     *
     * Registries can also be marked insecure by hostname. Those registries are
     * listed under `IndexConfigs` and have their `Secure` field set to
     * `false`.> **Warning**: Using this option can be useful when running a
     * local registry, but introduces> Security vulnerabilities. This option
     * should therefore ONLY be used for> Testing purposes. For increased
     * security, users should add their CA to> Their system's list of trusted
     * CAs instead of enabling this option.
     */
    InsecureRegistryCIDRs: S.optional(S.Array(S.String)),
    IndexConfigs: S.optional(S.Record(S.String, IndexInfo)),
    /**
     * List of registry URLs that act as a mirror for the official (`docker.io`)
     * registry.
     */
    Mirrors: S.optional(S.Array(S.String)),
});

export type RegistryServiceConfig = S.Schema.Type<typeof RegistryServiceConfig>;
export const RegistryServiceConfigEncoded = S.encodedSchema(RegistryServiceConfig);
export type RegistryServiceConfigEncoded = S.Schema.Encoded<typeof RegistryServiceConfig>;
