import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmContainerSpec extends Schema.Class<SwarmContainerSpec>("SwarmContainerSpec")(
    {
        Image: Schema.optional(Schema.String),
        Labels: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        Command: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Args: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Hostname: Schema.optional(Schema.String),
        Env: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Dir: Schema.optional(Schema.String),
        User: Schema.optional(Schema.String),
        Groups: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Privileges: Schema.optionalWith(MobySchemasGenerated.SwarmPrivileges, { nullable: true }),
        Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        StopSignal: Schema.optional(Schema.String),
        TTY: Schema.optional(Schema.Boolean),
        OpenStdin: Schema.optional(Schema.Boolean),
        ReadOnly: Schema.optional(Schema.Boolean),
        Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.Mount)), { nullable: true }),
        StopGracePeriod: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        Healthcheck: Schema.optionalWith(MobySchemasGenerated.ContainerHealthConfig, { nullable: true }),
        Hosts: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        DNSConfig: Schema.optionalWith(MobySchemasGenerated.SwarmDNSConfig, { nullable: true }),
        Secrets: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmSecretReference)), {
            nullable: true,
        }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmConfigReference)), {
            nullable: true,
        }),
        Isolation: Schema.optional(Schema.String),
        Sysctls: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        CapabilityAdd: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        CapabilityDrop: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        Ulimits: Schema.optionalWith(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerUlimit)), {
            nullable: true,
        }),
        OomScoreAdj: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmContainerSpec",
        title: "swarm.ContainerSpec",
    }
) {}
