import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

/** An open port on a container */
export const Port = S.Struct({
    /** Host IP address that the container's port is mapped to */
    IP: S.optional(S.String),
    /** Port on the container */
    PrivatePort: pipe(S.Number, S.int()),
    /** Port exposed on the host */
    PublicPort: S.optional(pipe(S.Number, S.int())),
    Type: S.Literal("tcp", "udp", "sctp"),
});

export type Port = S.Schema.Type<typeof Port>;
export const PortEncoded = S.encodedSchema(Port);
export type PortEncoded = S.Schema.Encoded<typeof Port>;
