import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as PortSchemas from "../schemas/port.ts";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.js";

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")(
    {
        Hostname: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Domainname: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        User: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        AttachStdin: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        AttachStdout: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        AttachStderr: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        ExposedPorts: Schema.optionalWith(PortSchemas.PortSet, { nullable: true }),
        Tty: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        OpenStdin: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        StdinOnce: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        Env: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        Cmd: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        Healthcheck: Schema.optionalWith(V1HealthcheckConfig.V1HealthcheckConfig, { nullable: true }),
        ArgsEscaped: Schema.optional(Schema.Boolean),
        Image: Schema.String,
        Volumes: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.Object }))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        WorkingDir: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "")),
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        NetworkDisabled: Schema.optional(Schema.Boolean),
        MacAddress: Schema.optional(Schema.String),
        OnBuild: Schema.NullishOr(Schema.Array(Schema.String))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        Labels: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String }))
            .pipe(Schema.propertySignature)
            .pipe(Schema.withConstructorDefault(() => null)),
        StopSignal: Schema.optional(Schema.String),
        StopTimeout: Schema.optionalWith(EffectSchemas.Number.I64, { nullable: true }),
        Shell: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "ContainerConfig",
        title: "container.Config",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Config",
    }
) {}
