import * as Data from "effect/Data";
import * as Predicate from "effect/Predicate";

import type * as DockerEngine from "../../DockerEngine.ts";

/** @internal */
export const DockerErrorTypeId: DockerEngine.DockerErrorTypeId = Symbol.for(
    "@the-moby-effect/engines/Docker/DockerError"
) as DockerEngine.DockerErrorTypeId;

/** @internal */
export const isDockerError = (u: unknown): u is DockerError => Predicate.hasProperty(u, DockerErrorTypeId);

/** @internal */
export class DockerError extends Data.TaggedError("DockerError")<{
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
    public readonly [DockerErrorTypeId]: DockerEngine.DockerErrorTypeId = DockerErrorTypeId;

    public override get message() {
        return `When calling ${this.method} in ${this.module}`;
    }

    public static WrapForModule(module: DockerError["module"]) {
        return (method: string) => (cause: unknown) => new this({ module, method, cause });
    }
}
