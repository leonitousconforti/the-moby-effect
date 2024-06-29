import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { GenericResources } from "./GenericResources.js";
import { ObjectVersion } from "./ObjectVersion.js";
import { TaskSpec } from "./TaskSpec.js";
import { TaskState } from "./TaskState.js";
import { TaskStatus } from "./TaskStatus.js";

export const Task = S.Struct({
    /** The ID of the task. */
    ID: S.optional(S.String),
    Version: S.optional(ObjectVersion),
    CreatedAt: S.optional(S.String),
    UpdatedAt: S.optional(S.String),
    /** Name of the task. */
    Name: S.optional(S.String),
    /** User-defined key/value metadata. */
    Labels: S.optional(S.Record(S.String, S.String)),
    Spec: S.optional(TaskSpec),
    /** The ID of the service this task is part of. */
    ServiceID: S.optional(S.String),
    Slot: S.optional(pipe(S.Number, S.int())),
    /** The ID of the node that this task is on. */
    NodeID: S.optional(S.String),
    AssignedGenericResources: S.optional(GenericResources),
    Status: S.optional(TaskStatus),
    DesiredState: S.optional(TaskState),
    JobIteration: S.optional(ObjectVersion),
});

export type Task = S.Schema.Type<typeof Task>;
export const TaskEncoded = S.encodedSchema(Task);
export type TaskEncoded = S.Schema.Encoded<typeof Task>;
