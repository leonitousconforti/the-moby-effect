import * as Schema from "@effect/schema/Schema";

export class ServiceCreateResponse extends Schema.Class<ServiceCreateResponse>("ServiceCreateResponse")(
    {
        ID: Schema.String,
        Warnings: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "ServiceCreateResponse",
        title: "types.ServiceCreateResponse",
    }
) {}
