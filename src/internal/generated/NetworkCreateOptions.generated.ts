import * as Schema from "effect/Schema";
import * as NetworkConfigReference from "./NetworkConfigReference.generated.js";
import * as NetworkIPAM from "./NetworkIPAM.generated.js";

export class NetworkCreateOptions extends Schema.Class<NetworkCreateOptions>("NetworkCreateOptions")(
    {
        Driver: Schema.String.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => "bridge")),
        Scope: Schema.optionalWith(Schema.String, { nullable: true }),
        EnableIPv4: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        EnableIPv6: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        IPAM: Schema.optionalWith(NetworkIPAM.NetworkIPAM, { nullable: true }),
        Internal: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        Attachable: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        Ingress: Schema.optionalWith(Schema.Boolean, { nullable: true }),
        ConfigOnly: Schema.Boolean.pipe(Schema.propertySignature).pipe(Schema.withConstructorDefault(() => false)),
        ConfigFrom: Schema.optionalWith(NetworkConfigReference.NetworkConfigReference, { nullable: true }),
        Options: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
        Labels: Schema.optionalWith(Schema.Record({ key: Schema.String, value: Schema.String }), { nullable: true }),
    },
    {
        identifier: "NetworkCreateOptions",
        title: "network.CreateOptions",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#CreateOptions",
    }
) {}
