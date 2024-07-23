import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class SwarmContainerSpec extends Schema.Class<SwarmContainerSpec>("SwarmContainerSpec")(
    {
        Image: Schema.optional(Schema.String),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Command: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Args: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Hostname: Schema.optional(Schema.String),
        Env: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Dir: Schema.optional(Schema.String),
        User: Schema.optional(Schema.String),
        Groups: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Privileges: Schema.optional(MobySchemasGenerated.SwarmPrivileges, { nullable: true }),
        Init: Schema.optional(Schema.Boolean, { nullable: true }),
        StopSignal: Schema.optional(Schema.String),
        TTY: Schema.optional(Schema.Boolean),
        OpenStdin: Schema.optional(Schema.Boolean),
        ReadOnly: Schema.optional(Schema.Boolean),
        Mounts: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.Mount)), { nullable: true }),
        StopGracePeriod: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Healthcheck: Schema.optional(MobySchemasGenerated.ContainerHealthConfig, { nullable: true }),
        Hosts: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        DNSConfig: Schema.optional(MobySchemasGenerated.SwarmDNSConfig, { nullable: true }),
        Secrets: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmSecretReference)), {
            nullable: true,
        }),
        Configs: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.SwarmConfigReference)), {
            nullable: true,
        }),
        Isolation: Schema.optional(Schema.String),
        Sysctls: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        CapabilityAdd: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        CapabilityDrop: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Ulimits: Schema.optional(Schema.Array(Schema.NullOr(MobySchemasGenerated.ContainerUlimit)), { nullable: true }),
        OomScoreAdj: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmContainerSpec",
        title: "swarm.ContainerSpec",
    }
) {}
