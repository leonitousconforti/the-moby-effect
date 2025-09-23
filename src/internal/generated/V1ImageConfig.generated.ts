import * as Schema from "effect/Schema";

export class V1ImageConfig extends Schema.Class<V1ImageConfig>("V1ImageConfig")(
    {
        User: Schema.optional(Schema.String),
        ExposedPorts: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), {
            nullable: true,
        }),
        Env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Entrypoint: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Cmd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Volumes: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.Object }), { nullable: true }),
        WorkingDir: Schema.optional(Schema.String),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        StopSignal: Schema.optional(Schema.String),
        ArgsEscaped: Schema.optional(Schema.Boolean),
    },
    {
        identifier: "V1ImageConfig",
        title: "v1.ImageConfig",
        documentation: "",
    }
) {}
