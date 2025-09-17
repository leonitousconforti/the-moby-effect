import { HttpApiSchema } from "@effect/platform";

/** @since 1.0.0 */
export class NodeNotPartOfSwarm extends HttpApiSchema.EmptyError<NodeNotPartOfSwarm>()({
    tag: "NodeNotPartOfSwarm",
    status: 503,
}) {}

/** @since 1.0.0 */
export class NodeAlreadyPartOfSwarm extends HttpApiSchema.EmptyError<NodeAlreadyPartOfSwarm>()({
    tag: "NodeAlreadyPartOfSwarm",
    status: 503,
}) {}
