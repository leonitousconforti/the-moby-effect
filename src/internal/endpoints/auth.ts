import type * as Array from "effect/Array";
import type * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint";

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Function from "effect/Function";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Predicate from "effect/Predicate";
import * as Redacted from "effect/Redacted";
import * as HttpClient from "effect/unstable/http/HttpClient";
import * as HttpClientRequest from "effect/unstable/http/HttpClientRequest";

import { DockerError } from "./circular.ts";
import { System } from "./system.js";

/**
 * @since 1.0.0
 * @category Auth
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
 */
export class RegistryAuth extends Context.Service<RegistryAuth>()(
    "the-moby-effect/endpoints/httpApiHacks/RegistryAuth",
    {
        make: (authHeader: Redacted.Redacted<string>) =>
            Effect.succeed({
                authHeader,
            } as const),
    }
) {
    /**
     * @since 1.0.0
     * @category Auth
     * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
     */
    static readonly Live = (authHeader: Redacted.Redacted<string>): Layer.Layer<RegistryAuth, never, never> =>
        Layer.effect(RegistryAuth, RegistryAuth.make(authHeader));

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
            return { authHeader: redacted } as const;
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
        Function.pipe(
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

                if (
                    Predicate.isObject(response) &&
                    "IdentityToken" in response &&
                    Predicate.isString(response.IdentityToken)
                ) {
                    return Effect.succeed(response.IdentityToken);
                }

                return WrapError(new Error("Registry authentication returned no response"));
            }),
            Effect.map((token) => ({
                authHeader: Redacted.make(token),
            })),
            Layer.effect(RegistryAuth)
        );
}

/**
 * @since 1.0.0
 * @category Auth
 * @see https://docs.docker.com/reference/api/engine/version/v1.51/#section/Authentication
 */
export const WithRegistryAuthHeader = (
    ...sendHeaderWithEndpoints: Array.NonEmptyReadonlyArray<
        HttpApiEndpoint.Constraint & {
            readonly path: string;
        }
    >
) =>
    HttpClient.mapRequestEffect(
        Effect.fn("HttpApiHacks.withRegistryAUthHeader")(function* (request: HttpClientRequest.HttpClientRequest) {
            const url = HttpClientRequest.toUrl(request);
            if (Option.isNone(url)) {
                return request;
            }

            if (!sendHeaderWithEndpoints.some((endpoint) => url.value.pathname.startsWith(endpoint.path))) {
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
