import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class ConfigReferenceFileTarget extends Schema.Class<ConfigReferenceFileTarget>("ConfigReferenceFileTarget")(
    {
        Name: Schema.NullOr(Schema.String),
        UID: Schema.NullOr(Schema.String),
        GID: Schema.NullOr(Schema.String),
        Mode: Schema.NullOr(MobySchemas.UInt32),
    },
    {
        identifier: "ConfigReferenceFileTarget",
        title: "swarm.ConfigReferenceFileTarget",
    }
) {}
