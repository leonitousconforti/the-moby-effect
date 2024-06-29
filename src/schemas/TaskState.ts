import { Schema as S } from "@effect/schema";

export const TaskState = S.Literal(
    "new",
    "allocated",
    "pending",
    "assigned",
    "accepted",
    "preparing",
    "ready",
    "starting",
    "running",
    "complete",
    "shutdown",
    "failed",
    "rejected",
    "remove",
    "orphaned"
);

export type TaskState = S.Schema.Type<typeof TaskState>;
export const TaskStateEncoded = S.encodedSchema(TaskState);
export type TaskStateEncoded = S.Schema.Encoded<typeof TaskState>;
