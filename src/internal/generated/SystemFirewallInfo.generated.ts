import * as Schema from "effect/Schema";

export class SystemFirewallInfo extends Schema.Class<SystemFirewallInfo>("SystemFirewallInfo")(
    {
        Driver: Schema.String,
        Info: Schema.optional(
            Schema.NullOr(Schema.Array(Schema.Array(Schema.String).check(Schema.isLengthBetween(2, 2))))
        ),
    },
    {
        identifier: "SystemFirewallInfo",
        title: "system.FirewallInfo",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/system#FirewallInfo",
    }
) {}
