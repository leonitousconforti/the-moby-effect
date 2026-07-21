import * as Schema from "effect/Schema";
import * as Effect from "effect/Effect";
import * as PortSchemas from "../schemas/port.ts";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.ts";

export class ContainerConfig extends Schema.Class<ContainerConfig>("ContainerConfig")(
    {
        Hostname: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Domainname: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        User: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        AttachStdin: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        AttachStdout: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        AttachStderr: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        ExposedPorts: Schema.optional(Schema.NullOr(PortSchemas.PortSet)),
        Tty: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        OpenStdin: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        StdinOnce: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        Env: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        Cmd: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        Healthcheck: Schema.optional(Schema.NullOr(V1HealthcheckConfig.V1HealthcheckConfig)),
        ArgsEscaped: Schema.optional(Schema.Boolean),
        Image: Schema.String,
        Volumes: Schema.NullOr(Schema.Record(Schema.String, Schema.ObjectKeyword)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        WorkingDir: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        Entrypoint: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        NetworkDisabled: Schema.optional(Schema.Boolean),
        MacAddress: Schema.optional(Schema.String),
        OnBuild: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        StopSignal: Schema.optional(Schema.String),
        StopTimeout: Schema.optional(Schema.NullOr(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })))),
        Shell: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
    },
    {
        identifier: "ContainerConfig",
        title: "container.Config",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/container#Config",
    }
) {}
