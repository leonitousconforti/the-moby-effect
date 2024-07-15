import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class SecretReferenceFileTarget extends Schema.Class<SecretReferenceFileTarget>("SecretReferenceFileTarget")(
    {
        Name: Schema.NullOr(Schema.String),
        UID: Schema.NullOr(Schema.String),
        GID: Schema.NullOr(Schema.String),
        Mode: Schema.NullOr(MobySchemas.UInt32),
    },
    {
        identifier: "SecretReferenceFileTarget",
        title: "swarm.SecretReferenceFileTarget",
    }
) {}
