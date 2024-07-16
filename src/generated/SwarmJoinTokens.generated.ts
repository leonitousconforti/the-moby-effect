import * as Schema from "@effect/schema/Schema";

export class SwarmJoinTokens extends Schema.Class<SwarmJoinTokens>("SwarmJoinTokens")(
    {
        Worker: Schema.String,
        Manager: Schema.String,
    },
    {
        identifier: "SwarmJoinTokens",
        title: "swarm.JoinTokens",
    }
) {}
