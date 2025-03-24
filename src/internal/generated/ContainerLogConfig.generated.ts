import * as Schema from "effect/Schema";

export class ContainerLogConfig extends Schema.Class<ContainerLogConfig>("ContainerLogConfig")(
    {
        Type: Schema.String,
        Config: Schema.NullOr(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            })
        ),
    },
    {
        identifier: "ContainerLogConfig",
        title: "container.LogConfig",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/container/hostconfig.go#L357-L361",
    }
) {}
