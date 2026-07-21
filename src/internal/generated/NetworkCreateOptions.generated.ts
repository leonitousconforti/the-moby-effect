import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as NetworkConfigReference from "./NetworkConfigReference.generated.ts";
import * as NetworkIPAM from "./NetworkIPAM.generated.ts";

export class NetworkCreateOptions extends Schema.Class<NetworkCreateOptions>("NetworkCreateOptions")(
    {
        Driver: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed("bridge"))),
        Scope: Schema.optional(Schema.String),
        EnableIPv4: Schema.optional(Schema.NullOr(Schema.Boolean)),
        EnableIPv6: Schema.optional(Schema.NullOr(Schema.Boolean)),
        IPAM: Schema.optional(Schema.NullOr(NetworkIPAM.NetworkIPAM)),
        Internal: Schema.optional(Schema.Boolean),
        Attachable: Schema.optional(Schema.Boolean),
        Ingress: Schema.optional(Schema.Boolean),
        ConfigOnly: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        ConfigFrom: Schema.optional(Schema.NullOr(NetworkConfigReference.NetworkConfigReference)),
        Options: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
        Labels: Schema.optional(Schema.NullOr(Schema.Record(Schema.String, Schema.String))),
    },
    {
        identifier: "NetworkCreateOptions",
        title: "network.CreateOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#CreateOptions",
    }
) {}
