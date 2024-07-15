import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class ResourceRequirements extends Schema.Class<ResourceRequirements>("ResourceRequirements")(
    {
        Limits: Schema.optional(MobySchemasGenerated.Limit, { nullable: true }),
        Reservations: Schema.optional(MobySchemasGenerated.Resources, { nullable: true }),
    },
    {
        identifier: "ResourceRequirements",
        title: "swarm.ResourceRequirements",
    }
) {}
