import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class Version extends Schema.Class<Version>("Version")(
    {
        Index: Schema.optional(MobySchemas.UInt64, { nullable: true }),
    },
    {
        identifier: "Version",
        title: "swarm.Version",
    }
) {}
