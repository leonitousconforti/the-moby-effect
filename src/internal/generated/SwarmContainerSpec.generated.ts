import * as Schema from "effect/Schema";

import * as MobyNumber from "../schemas/number.ts";
import * as MountMount from "./MountMount.generated.ts";
import * as SwarmConfigReference from "./SwarmConfigReference.generated.ts";
import * as SwarmDNSConfig from "./SwarmDNSConfig.generated.ts";
import * as SwarmPrivileges from "./SwarmPrivileges.generated.ts";
import * as SwarmSecretReference from "./SwarmSecretReference.generated.ts";
import * as UnitsUlimit from "./UnitsUlimit.generated.ts";
import * as V1HealthcheckConfig from "./V1HealthcheckConfig.generated.ts";

export class SwarmContainerSpec extends Schema.Class<SwarmContainerSpec>("SwarmContainerSpec")(
    {
        Image: Schema.optional(Schema.String),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Command: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Args: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Hostname: Schema.optional(Schema.String),
        Env: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Dir: Schema.optional(Schema.String),
        User: Schema.optional(Schema.String),
        Groups: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Privileges: Schema.optional(Schema.NullOr(SwarmPrivileges.SwarmPrivileges)),
        Init: Schema.optional(Schema.NullOr(Schema.Boolean)),
        StopSignal: Schema.optional(Schema.String),
        TTY: Schema.optional(Schema.Boolean),
        OpenStdin: Schema.optional(Schema.Boolean),
        ReadOnly: Schema.optional(Schema.Boolean),
        Mounts: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(MountMount.MountMount)))),
        StopGracePeriod: Schema.optional(
            Schema.NullOr(
                MobyNumber.BigIntFromWireString.check(
                    Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
                )
            )
        ),
        Healthcheck: Schema.optional(Schema.NullOr(V1HealthcheckConfig.V1HealthcheckConfig)),
        Hosts: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        DNSConfig: Schema.optional(Schema.NullOr(SwarmDNSConfig.SwarmDNSConfig)),
        Secrets: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmSecretReference.SwarmSecretReference)))),
        Configs: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(SwarmConfigReference.SwarmConfigReference)))),
        Isolation: Schema.optional(Schema.Literals(["", "default", "process", "hyperv"])),
        Sysctls: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        CapabilityAdd: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        CapabilityDrop: Schema.optional(Schema.NullOr(Schema.Array(Schema.String))),
        Ulimits: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(UnitsUlimit.UnitsUlimit)))),
        OomScoreAdj: Schema.optional(
            MobyNumber.BigIntFromWireString.check(
                Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })
            )
        ),
    },
    {
        identifier: "SwarmContainerSpec",
        title: "swarm.ContainerSpec",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ContainerSpec",
    }
) {}
