import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmNetworkAttachment extends Schema.Class<SwarmNetworkAttachment>("SwarmNetworkAttachment")(
    {
        Network: Schema.optional(MobySchemasGenerated.SwarmNetwork),
        Addresses: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "SwarmNetworkAttachment",
        title: "swarm.NetworkAttachment",
    }
) {}
