import * as Schema from "effect/Schema";

export class V1ImageConfig extends Schema.Class<V1ImageConfig>("V1ImageConfig")(
    {
        User: Schema.optional(Schema.String),
        ExposedPorts: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.ObjectKeyword))),
        Env: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Entrypoint: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Cmd: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Volumes: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.ObjectKeyword))),
        WorkingDir: Schema.optional(Schema.String),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        StopSignal: Schema.optional(Schema.String),
        ArgsEscaped: Schema.optional(Schema.Boolean),
    },
    {
        identifier: "V1ImageConfig",
        title: "v1.ImageConfig",
        documentation: "",
    }
) {}
