import * as Schema from "@effect/schema/Schema";

export class JoinTokens extends Schema.Class<JoinTokens>("JoinTokens")(
    {
        Worker: Schema.NullOr(Schema.String),
        Manager: Schema.NullOr(Schema.String),
    },
    {
        identifier: "JoinTokens",
        title: "swarm.JoinTokens",
    }
) {}
