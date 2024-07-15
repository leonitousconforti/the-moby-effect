import * as Schema from "@effect/schema/Schema";

export class NamedGenericResource extends Schema.Class<NamedGenericResource>("NamedGenericResource")(
    {
        Kind: Schema.optional(Schema.String, { nullable: true }),
        Value: Schema.optional(Schema.String, { nullable: true }),
    },
    {
        identifier: "NamedGenericResource",
        title: "swarm.NamedGenericResource",
    }
) {}
