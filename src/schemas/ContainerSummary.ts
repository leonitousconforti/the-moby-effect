import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { EndpointSettings } from "./EndpointSettings.js";
import { MountPoint } from "./MountPoint.js";
import { Port } from "./Port.js";

export const ContainerSummary = S.Struct({
    /** The ID of this container */
    Id: S.optional(S.String),
    /** The names that this container has been given */
    Names: S.optional(S.Array(S.String)),
    /** The name of the image used when creating this container */
    Image: S.optional(S.String),
    /** The ID of the image that this container was created from */
    ImageID: S.optional(S.String),
    /** Command to run when starting the container */
    Command: S.optional(S.String),
    /** When the container was created */
    Created: S.optional(pipe(S.Number, S.int())),
    /** The ports exposed by this container */
    Ports: S.optional(S.Array(Port)),
    /** The size of files that have been created or changed by this container */
    SizeRw: S.optional(pipe(S.Number, S.int())),
    /** The total size of all the files in this container */
    SizeRootFs: S.optional(pipe(S.Number, S.int())),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    /** The state of this container (e.g. `Exited`) */
    State: S.optional(S.String),
    /** Additional human-readable status of this container (e.g. `Exit 0`) */
    Status: S.optional(S.String),
    HostConfig: S.optional(
        S.Struct({
            NetworkMode: S.optional(S.String),
        })
    ),
    /** A summary of the container's network settings */
    NetworkSettings: S.optional(
        S.Struct({
            Networks: S.optional(S.Record(S.String, EndpointSettings)),
        })
    ),
    Mounts: S.optional(S.Array(MountPoint)),
});

export type ContainerSummary = S.Schema.Type<typeof ContainerSummary>;
export const ContainerSummaryEncoded = S.encodedSchema(ContainerSummary);
export type ContainerSummaryEncoded = S.Schema.Encoded<typeof ContainerSummary>;
