import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ContainerSpec extends Schema.Class<ContainerSpec>("ContainerSpec")(
    {
        Image: Schema.optional(Schema.String, { nullable: true }),
        Labels: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        Command: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Args: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Hostname: Schema.optional(Schema.String, { nullable: true }),
        Env: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Dir: Schema.optional(Schema.String, { nullable: true }),
        User: Schema.optional(Schema.String, { nullable: true }),
        Groups: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Privileges: Schema.optional(MobySchemasGenerated.Privileges, { nullable: true }),
        Init: Schema.optional(Schema.Boolean, { nullable: true }),
        StopSignal: Schema.optional(Schema.String, { nullable: true }),
        TTY: Schema.optional(Schema.Boolean, { nullable: true }),
        OpenStdin: Schema.optional(Schema.Boolean, { nullable: true }),
        ReadOnly: Schema.optional(Schema.Boolean, { nullable: true }),
        Mounts: Schema.optional(Schema.Array(MobySchemasGenerated.Mount), { nullable: true }),
        StopGracePeriod: Schema.optional(MobySchemas.Int64, { nullable: true }),
        Healthcheck: Schema.optional(MobySchemasGenerated.HealthConfig, { nullable: true }),
        Hosts: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        DNSConfig: Schema.optional(MobySchemasGenerated.DNSConfig, { nullable: true }),
        Secrets: Schema.optional(Schema.Array(MobySchemasGenerated.SecretReference), { nullable: true }),
        Configs: Schema.optional(Schema.Array(MobySchemasGenerated.ConfigReference), { nullable: true }),
        Isolation: Schema.optional(Schema.String, { nullable: true }),
        Sysctls: Schema.optional(Schema.Record(Schema.String, Schema.String), { nullable: true }),
        CapabilityAdd: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        CapabilityDrop: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
        Ulimits: Schema.optional(Schema.Array(MobySchemasGenerated.Ulimit), { nullable: true }),
    },
    {
        identifier: "ContainerSpec",
        title: "swarm.ContainerSpec",
    }
) {}
