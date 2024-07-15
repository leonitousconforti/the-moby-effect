import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";

export class RestartPolicy extends Schema.Class<RestartPolicy>("RestartPolicy")(
    {
        Name: Schema.NullOr(Schema.String),
        MaximumRetryCount: Schema.NullOr(MobySchemas.Int64),
    },
    {
        identifier: "RestartPolicy",
        title: "container.RestartPolicy",
    }
) {}
