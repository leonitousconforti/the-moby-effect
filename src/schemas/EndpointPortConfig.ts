import { Schema as S } from "@effect/schema";
import { pipe } from "effect";

export const EndpointPortConfig = S.Struct({
    Name: S.optional(S.String),
    Protocol: S.optional(S.Literal("tcp", "udp", "sctp")),
    /** The port inside the container. */
    TargetPort: S.optional(pipe(S.Number, S.int())),
    /** The port on the swarm hosts. */
    PublishedPort: S.optional(pipe(S.Number, S.int())),
    /**
     * The mode in which port is published. <p><br /></p>
     *
     * - "ingress" makes the target port accessible on every node, regardless of
     *   whether there is a task for the service running on that node or not.
     * - "host" bypasses the routing mesh and publish the port directly on the
     *   swarm node where that service is running.
     */
    PublishMode: S.optional(S.Literal("ingress", "host"), {
        default: () => "ingress",
    }),
});

export type EndpointPortConfig = S.Schema.Type<typeof EndpointPortConfig>;
export const EndpointPortConfigEncoded = S.encodedSchema(EndpointPortConfig);
export type EndpointPortConfigEncoded = S.Schema.Encoded<typeof EndpointPortConfig>;
