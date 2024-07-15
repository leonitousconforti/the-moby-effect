import * as Schema from "@effect/schema/Schema";

export class Secret extends Schema.Class<Secret>("Secret")(
    {
        /**
         * Key is the name of the key of the key-value pair passed to the
         * plugin.
         */
        Key: Schema.String,

        /**
         * Secret is the swarm Secret object from which to read data. This can
         * be a Secret name or ID. The Secret data is retrieved by Swarm and
         * used as the value of the key-value pair passed to the plugin.
         */
        Secret: Schema.String,
    },
    {
        identifier: "Secret",
        title: "volume.Secret",
    }
) {}
