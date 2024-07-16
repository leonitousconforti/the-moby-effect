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
        Created: Schema.String,
        Container: Schema.String,
        ContainerConfig: Schema.NullOr(MobySchemasGenerated.ContainerConfig),
        DockerVersion: Schema.String,
        Author: Schema.String,
        Config: Schema.NullOr(MobySchemasGenerated.ContainerConfig),
        Architecture: Schema.String,
        Variant: Schema.optional(Schema.String),
        Os: Schema.String,
        OsVersion: Schema.optional(Schema.String),
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
        GraphDriver: MobySchemasGenerated.GraphDriverData,
        RootFS: MobySchemasGenerated.RootFS,
        Metadata: MobySchemasGenerated.ImageMetadata,
    },
    {
        identifier: "ImageInspectResponse",
        title: "types.ImageInspect",
    }
) {}
