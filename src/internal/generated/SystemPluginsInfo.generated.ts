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
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/system/info.go#L124-L135",
    }
) {}
