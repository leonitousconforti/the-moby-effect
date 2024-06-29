import { Schema as S } from "@effect/schema";

import { ContainerStatus } from "./ContainerStatus.js";
import { PortStatus } from "./PortStatus.js";
import { TaskState } from "./TaskState.js";

/** Represents the status of a task. */
export const TaskStatus = S.Struct({
    Timestamp: S.optional(S.String),
    State: S.optional(TaskState),
    Message: S.optional(S.String),
    Err: S.optional(S.String),
    ContainerStatus: S.optional(ContainerStatus),
    PortStatus: S.optional(PortStatus),
});

export type TaskStatus = S.Schema.Type<typeof TaskStatus>;
export const TaskStatusEncoded = S.encodedSchema(TaskStatus);
export type TaskStatusEncoded = S.Schema.Encoded<typeof TaskStatus>;
