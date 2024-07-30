import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as SwarmSpec from "./SwarmSpec.generated.js";

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>("SwarmInitRequest")(
    {
        /**
         * Listen address used for inter-manager communication, as well as
         * determining the networking interface used for the VXLAN Tunnel
         * Endpoint (VTEP). This can either be an address/port combination in
         * the form 192.168.1.1:4567, or an interface followed by a port number,
         * like eth0:4567. If the port number is omitted, the default swarm
         * listening port is used.
         */
        ListenAddr: Schema.Union(
            Schema.TemplateLiteral(Schema.String, ":", Schema.Number),
            MobySchemas.AddressString,
            Schema.String
        ),

        /**
         * Externally reachable address advertised to other nodes. This can
         * either be an address/port combination in the form 192.168.1.1:4567,
         * or an interface followed by a port number, like eth0:4567. If the
         * port number is omitted, the port number from the listen address is
         * used. If AdvertiseAddr is not specified, it will be automatically
         * detected when possible.
         */
        AdvertiseAddr: Schema.optionalWith(
            Schema.Union(
                Schema.TemplateLiteral(Schema.String, ":", Schema.Number),
                MobySchemas.AddressString,
                Schema.String
            ),
            { nullable: true }
        ),

        /**
         * Address or interface to use for data path traffic (format:
         * <ip|interface>), for example, 192.168.1.1, or an interface, like
         * eth0. If DataPathAddr is unspecified, the same address as
         * AdvertiseAddr is used.
         *
         * The DataPathAddr specifies the address that global scope network
         * drivers will publish towards other nodes in order to reach the
         * containers running on this node. Using this parameter it is possible
         * to separate the container data traffic from the management traffic of
         * the cluster.
         */
        DataPathAddr: Schema.optionalWith(Schema.Union(MobySchemas.AddressString, Schema.String), { nullable: true }),

        /**
         * DataPathPort specifies the data path port number for data traffic.
         * Acceptable port range is 1024 to 49151. if no port is set or is set
         * to 0, default port 4789 will be used.
         */
        DataPathPort: Schema.optionalWith(MobySchemas.Port, { nullable: true }),

        /** Force creation of a new swarm. */
        ForceNewCluster: Schema.optionalWith(Schema.Boolean, { nullable: true }),

        /** User modifiable swarm configuration. */
        Spec: Schema.optionalWith(SwarmSpec.SwarmSpec, { nullable: true }),

        /**
         * Default Address Pool specifies default subnet pools for global scope
         * networks.
         */
        DefaultAddrPool: Schema.optionalWith(Schema.Array(MobySchemas.CidrBlockFromString), { nullable: true }),

        /**
         * SubnetSize specifies the subnet size of the networks created from the
         * default subnet pool.
         */
        SubnetSize: Schema.optionalWith(MobySchemas.UInt32, {
            default: () => MobySchemas.UInt32Schemas.UInt32Brand(24),
            nullable: true,
        }),

        AutoLockManagers: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        Availability: Schema.optionalWith(Schema.Literal("active", "pause", "drain"), { nullable: true }),
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L152-L164",
    }
) {}
