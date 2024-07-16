import * as Schema from "@effect/schema/Schema";

export class BuildResult extends Schema.Class<BuildResult>("BuildResult")(
    {
        ID: Schema.String,
    },
    {
        identifier: "BuildResult",
        title: "types.BuildResult",
    }
) {}
