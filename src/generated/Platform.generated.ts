import * as Schema from "@effect/schema/Schema";

export class Platform extends Schema.Class<Platform>("Platform")(
    {
        Architecture: Schema.optional(Schema.String, { nullable: true }),
        OS: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "Platform",
        title: "swarm.Platform",
    }
) {}
