import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class NetworkConnect extends Schema.Class<NetworkConnect>("NetworkConnect")(
    {
        Container: Schema.NullOr(Schema.String),
        EndpointConfig: Schema.optional(MobySchemasGenerated.EndpointSettings, { nullable: true }),
    },
    {
        identifier: "NetworkConnect",
        title: "types.NetworkConnect",
    }
) {}
