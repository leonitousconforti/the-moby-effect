import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SwarmJoinRequest extends Schema.Class<SwarmJoinRequest>("SwarmJoinRequest")(
    {
        /**
         * Listen address used for inter-manager communication if the node gets
         * promoted to manager, as well as determining the networking interface
         * used for the VXLAN Tunnel Endpoint (VTEP).
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

        /** Addresses of manager nodes already participating in the swarm. */
        RemoteAddrs: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),

        /** Secret token for joining this swarm. */
        JoinToken: Schema.String,
        Availability: Schema.optionalWith(Schema.Literal("active", "pause", "drain"), { nullable: true }),
    },
    {
        identifier: "SwarmJoinRequest",
        title: "swarm.JoinRequest",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/swarm/swarm.go#L166-L174",
    }
) {}
