import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkAttachment extends Schema.Class<NetworkAttachment>("NetworkAttachment")(
    {
        Network: Schema.optional(MobySchemasGenerated.Network),
        Addresses: Schema.optional(Schema.Array(Schema.String), { nullable: true }),
    },
    {
        identifier: "NetworkAttachment",
        title: "swarm.NetworkAttachment",
    }
) {}
