import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImageInspectResponse extends Schema.Class<ImageInspectResponse>("ImageInspectResponse")(
    {
        Id: Schema.String,
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        RepoDigests: Schema.NullOr(Schema.Array(Schema.String)),
        Parent: Schema.String,
        Comment: Schema.String,
        Created: Schema.optional(Schema.String),
        Container: Schema.optional(Schema.String),
        ContainerConfig: Schema.optionalWith(MobySchemasGenerated.ContainerConfig, { nullable: true }),
        DockerVersion: Schema.String,
        Author: Schema.String,
        Config: Schema.NullOr(MobySchemasGenerated.ContainerConfig),
        Architecture: Schema.String,
        Variant: Schema.optional(Schema.String),
        Os: Schema.String,
        OsVersion: Schema.optional(Schema.String),
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
        GraphDriver: Schema.NullOr(MobySchemasGenerated.GraphDriverData),
        RootFS: Schema.NullOr(MobySchemasGenerated.RootFS),
        Metadata: Schema.NullOr(MobySchemasGenerated.ImageMetadata),
    },
    {
        identifier: "ImageInspectResponse",
        title: "types.ImageInspect",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/image/image_inspect.go#L14-L122",
    }
) {}
