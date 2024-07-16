import * as Schema from "@effect/schema/Schema";
import * as MobySchemasGenerated from "./index.js";

export class SwarmResourceRequirements extends Schema.Class<SwarmResourceRequirements>("SwarmResourceRequirements")(
    {
        Limits: Schema.optional(MobySchemasGenerated.SwarmLimit, { nullable: true }),
        Reservations: Schema.optional(MobySchemasGenerated.SwarmResources, { nullable: true }),
    },
    {
        identifier: "SwarmResourceRequirements",
        title: "swarm.ResourceRequirements",
    }
) {}
