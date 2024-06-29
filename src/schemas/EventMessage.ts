import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

import { EventActor } from "./EventActor.js";

/** EventMessage represents the information an event contains. */
export const EventMessage = S.Struct({
    /** The type of object emitting the event */
    Type: S.optional(
        S.Literal(
            "builder",
            "config",
            "container",
            "daemon",
            "image",
            "network",
            "node",
            "plugin",
            "secret",
            "service",
            "volume"
        )
    ),
    /** The type of event */
    Action: S.optional(S.String),
    Actor: S.optional(EventActor),
    /**
     * Scope of the event. Engine events are `local` scope. Cluster (Swarm)
     * events are `swarm` scope.
     */
    scope: S.optional(S.Literal("local", "swarm")),
    /** Timestamp of event */
    time: S.optional(pipe(S.Number, S.int())),
    /** Timestamp of event, with nanosecond accuracy */
    timeNano: S.optional(pipe(S.Number, S.int())),
});

export type EventMessage = S.Schema.Type<typeof EventMessage>;
export const EventMessageEncoded = S.encodedSchema(EventMessage);
export type EventMessageEncoded = S.Schema.Encoded<typeof EventMessage>;
