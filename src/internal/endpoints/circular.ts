import type * as DockerEngine from "../../DockerEngine.ts";

import * as PlatformError from "@effect/platform/Error";
import * as Predicate from "effect/Predicate";

/** @internal */
export const DockerErrorTypeId: DockerEngine.DockerErrorTypeId = Symbol.for(
    "@the-moby-effect/engines/Docker/DockerError"
) as DockerEngine.DockerErrorTypeId;

/** @internal */
export const isDockerError = (u: unknown): u is DockerError => Predicate.hasProperty(u, DockerErrorTypeId);

/** @internal */
export class DockerError extends PlatformError.TypeIdError(DockerErrorTypeId, "DockerError")<{
    module:
        | "configs"
        | "containers"
        | "distributions"
        | "execs"
        | "images"
        | "networks"
        | "nodes"
        | "plugins"
        | "secrets"
        | "services"
        | "session"
        | "swarm"
        | "system"
        | "tasks"
        | "volumes";
    method: string;
    cause: unknown;
}> {
    public static WrapForModule(module: DockerError["module"]) {
        return (method: string) => (cause: unknown) => new this({ module, method, cause });
    }
}
