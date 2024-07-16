import * as Schema from "@effect/schema/Schema";

export class ServiceUpdateResponse extends Schema.Class<ServiceUpdateResponse>("ServiceUpdateResponse")(
    {
        Warnings: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "ServiceUpdateResponse",
        title: "types.ServiceUpdateResponse",
    }
) {}
