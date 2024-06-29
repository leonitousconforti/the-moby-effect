import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { Health } from "./Health.js";

/**
 * ContainerState stores container's running state. It's part of
 * ContainerJSONBase and will be returned by the "inspect" command.
 */
export const ContainerState = S.Struct({
    /**
     * String representation of the container state. Can be one of "created",
     * "running", "paused", "restarting", "removing", "exited", or "dead".
     */
    Status: S.optional(S.Literal("created", "running", "paused", "restarting", "removing", "exited", "dead")),
    /**
     * Whether this container is running.
     *
     * Note that a running container can be _paused_. The `Running` and `Paused`
     * booleans are not mutually exclusive:
     *
     * When pausing a container (on Linux), the freezer cgroup is used to
     * suspend all processes in the container. Freezing the process requires the
     * process to be running. As a result, paused containers are both `Running`
     * _and_ `Paused`.
     *
     * Use the `Status` field instead to determine if a container's state is
     * "running".
     */
    Running: S.optional(S.Boolean),
    /** Whether this container is paused. */
    Paused: S.optional(S.Boolean),
    /** Whether this container is restarting. */
    Restarting: S.optional(S.Boolean),
    /**
     * Whether a process within this container has been killed because it ran
     * out of memory since the container was last started.
     */
    OOMKilled: S.optional(S.Boolean),
    Dead: S.optional(S.Boolean),
    /** The process ID of this container */
    Pid: S.optional(pipe(S.Number, S.int())),
    /** The last exit code of this container */
    ExitCode: S.optional(pipe(S.Number, S.int())),
    Error: S.optional(S.String),
    /** The time when this container was last started. */
    StartedAt: S.optional(S.String),
    /** The time when this container last exited. */
    FinishedAt: S.optional(S.String),
    Health: S.optional(Health),
});

export type ContainerState = S.Schema.Type<typeof ContainerState>;
export const ContainerStateEncoded = S.encodedSchema(ContainerState);
export type ContainerStateEncoded = S.Schema.Encoded<typeof ContainerState>;
