import * as Schema from "effect/Schema";

export class FirewallInfo extends Schema.Class<FirewallInfo>("FirewallInfo")(
    {
        Driver: Schema.String,
        Info: Schema.optionalWith(Schema.Array(Schema.Array(Schema.String).pipe(Schema.itemsCount(2))), {
            nullable: true,
        }),
    },
    {
        identifier: "FirewallInfo",
        title: "system.FirewallInfo",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L156-L162",
    }
) {}
