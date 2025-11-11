import { HttpClient, HttpClientRequest, type HttpApiEndpoint } from "@effect/platform";
import { Effect, Layer, Option, pipe, Predicate, Redacted, type Array } from "effect";

import { DockerError } from "./circular.ts";
import { System } from "./system.js";

/**
 * @since 1.0.0
 * @category Auth
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
 */
export class RegistryAuth extends Effect.Service<RegistryAuth>()(
    "the-moby-effect/endpoints/httpApiHacks/RegistryAuth",
    {
        accessors: false,
        dependencies: [],
        effect: (authHeader: Redacted.Redacted<string>) =>
            Effect.gen(function* () {
                return { authHeader } as const;
            }),
    }
) {
    /**
     * @since 1.0.0
     * @category Auth
     * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
     */
    static readonly Live = RegistryAuth.Default;

    /**
     * @since 1.0.0
     * @category Auth
     * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
     */
    static readonly Credentials = (credentials: {
        serverAddress?: string | undefined;
        username: Redacted.Redacted<string>;
        password: Redacted.Redacted<string>;
        email?: Redacted.Redacted<string> | undefined;
    }) =>
        Layer.sync(RegistryAuth, () => {
            const encoded = Buffer.from(
                JSON.stringify({
                    serveraddress: credentials.serverAddress,
                    username: Redacted.value(credentials.username),
                    password: Redacted.value(credentials.password),
                    email: credentials.email ? Redacted.value(credentials.email) : undefined,
                })
            ).toString("base64");

            const redacted = Redacted.make(encoded);
            return RegistryAuth.make({ authHeader: redacted });
        });

    /**
     * @since 1.0.0
     * @category Auth
     * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
     */
    static readonly Token = (credentials: {
        serverAddress?: string | undefined;
        username: Redacted.Redacted<string>;
        password: Redacted.Redacted<string>;
        email?: Redacted.Redacted<string> | undefined;
    }) =>
        pipe(
            System.use((systems) =>
                systems.auth({
                    serveraddress: credentials.serverAddress,
                    username: Redacted.value(credentials.username),
                    password: Redacted.value(credentials.password),
                    email: credentials.email ? Redacted.value(credentials.email) : undefined,
                })
            ),
            Effect.flatMap((response) => {
                const WrapError = DockerError.WrapForModule("system")("auth");

                if (Predicate.isObject(response) && "IdentityToken" in response) {
                    return Effect.succeed(response.IdentityToken);
                }

                return WrapError(new Error("Registry authentication returned no response"));
            }),
            Effect.map((token) =>
                RegistryAuth.make({
                    authHeader: Redacted.make(token),
                })
            ),
            Layer.effect(RegistryAuth)
        );
}

/**
 * @since 1.0.0
 * @category Auth
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
 */
export const WithRegistryAuthHeader = (
    ...sendHeaderWithEndpoints: Array.NonEmptyReadonlyArray<HttpApiEndpoint.HttpApiEndpoint.Any & { path: string }>
) =>
    HttpClient.mapRequestEffect(
        Effect.fn("HttpApiHacks.withRegistryAUthHeader")(function* (request: HttpClientRequest.HttpClientRequest) {
            console.log("Checking for registry auth header requirement for request to", request.url);
            if (!sendHeaderWithEndpoints.some((endpoint) => request.url?.startsWith(endpoint.path))) {
                return request;
            }

            const auth = yield* Effect.serviceOption(RegistryAuth);
            if (Option.isNone(auth)) {
                return request;
            }

            const header = Redacted.value(auth.value.authHeader);
            return HttpClientRequest.setHeader(request, "X-Registry-Auth", header);
        })
    );
