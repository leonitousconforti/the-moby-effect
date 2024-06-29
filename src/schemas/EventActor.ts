import { Schema as S } from "@effect/schema";

/**
 * Actor describes something that generates events, like a container, network,
 * or a volume.
 */
export const EventActor = S.Struct({
    /** The ID of the object emitting the event */
    ID: S.optional(S.String),
    /** Various key/value attributes of the object, depending on its type. */
    Attributes: S.optional(S.Record(S.String, S.String)),
});

export type EventActor = S.Schema.Type<typeof EventActor>;
export const EventActorEncoded = S.encodedSchema(EventActor);
export type EventActorEncoded = S.Schema.Encoded<typeof EventActor>;
