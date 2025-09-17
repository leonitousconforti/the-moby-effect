import * as Schema from "effect/Schema";

export class ContainerLogConfig extends Schema.Class<ContainerLogConfig>("ContainerLogConfig")(
    {
        Type: Schema.String,
        Config: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
    },
    {
        identifier: "ContainerLogConfig",
        title: "container.LogConfig",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#LogConfig",
    }
) {}
