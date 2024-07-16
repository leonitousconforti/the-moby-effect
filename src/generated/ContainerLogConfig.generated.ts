import * as Schema from "@effect/schema/Schema";

export class ContainerLogConfig extends Schema.Class<ContainerLogConfig>("ContainerLogConfig")(
    {
        Type: Schema.String,
        Config: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
    },
    {
        identifier: "ContainerLogConfig",
        title: "container.LogConfig",
    }
) {}
