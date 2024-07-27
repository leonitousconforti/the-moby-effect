import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerHealthConfig from "./ContainerHealthConfig.generated.js";
import * as ContainerUlimit from "./ContainerUlimit.generated.js";
import * as Mount from "./Mount.generated.js";
import * as SwarmConfigReference from "./SwarmConfigReference.generated.js";
import * as SwarmDNSConfig from "./SwarmDNSConfig.generated.js";
import * as SwarmPrivileges from "./SwarmPrivileges.generated.js";
import * as SwarmSecretReference from "./SwarmSecretReference.generated.js";

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
        Privileges: Schema.optionalWith(SwarmPrivileges.SwarmPrivileges, { nullable: true }),
        Init: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        StopSignal: Schema.optional(Schema.String),
        TTY: Schema.optional(Schema.Boolean),
        OpenStdin: Schema.optional(Schema.Boolean),
        ReadOnly: Schema.optional(Schema.Boolean),
        Mounts: Schema.optionalWith(Schema.Array(Schema.NullOr(Mount.Mount)), { nullable: true }),
        StopGracePeriod: Schema.optionalWith(MobySchemas.Int64, { nullable: true }),
        Healthcheck: Schema.optionalWith(ContainerHealthConfig.ContainerHealthConfig, { nullable: true }),
        Hosts: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        DNSConfig: Schema.optionalWith(SwarmDNSConfig.SwarmDNSConfig, { nullable: true }),
        Secrets: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmSecretReference.SwarmSecretReference)), {
            nullable: true,
        }),
        Configs: Schema.optionalWith(Schema.Array(Schema.NullOr(SwarmConfigReference.SwarmConfigReference)), {
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
        Ulimits: Schema.optionalWith(Schema.Array(Schema.NullOr(ContainerUlimit.ContainerUlimit)), {
            nullable: true,
        }),
        OomScoreAdj: Schema.optional(MobySchemas.Int64),
    },
    {
        identifier: "SwarmContainerSpec",
        title: "swarm.ContainerSpec",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/container.go#L86-L119",
    }
) {}
