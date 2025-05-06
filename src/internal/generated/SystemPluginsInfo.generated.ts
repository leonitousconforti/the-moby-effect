import * as Schema from "effect/Schema";

export class SystemPluginsInfo extends Schema.Class<SystemPluginsInfo>("SystemPluginsInfo")(
    {
        Volume: Schema.NullOr(Schema.Array(Schema.String)),
        Network: Schema.NullOr(Schema.Array(Schema.String)),
        Authorization: Schema.NullOr(Schema.Array(Schema.String)),
        Log: Schema.NullOr(Schema.Array(Schema.String)),
    },
    {
        identifier: "SystemPluginsInfo",
        title: "system.PluginsInfo",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/system/info.go#L125-L136",
    }
) {}
