import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as GraphDriverData from "./GraphDriverData.generated.js";
import * as ImageMetadata from "./ImageMetadata.generated.js";
import * as RootFS from "./RootFS.generated.js";

export class ImageInspectResponse extends Schema.Class<ImageInspectResponse>("ImageInspectResponse")(
    {
        Id: Schema.String,
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        RepoDigests: Schema.NullOr(Schema.Array(Schema.String)),
        Parent: Schema.String,
        Comment: Schema.String,
        Created: Schema.optional(Schema.String),
        Container: Schema.optional(Schema.String),
        ContainerConfig: Schema.optionalWith(ContainerConfig.ContainerConfig, { nullable: true }),
        DockerVersion: Schema.String,
        Author: Schema.String,
        Config: Schema.NullOr(ContainerConfig.ContainerConfig),
        Architecture: Schema.String,
        Variant: Schema.optional(Schema.String),
        Os: Schema.String,
        OsVersion: Schema.optional(Schema.String),
        Size: MobySchemas.Int64,
        VirtualSize: Schema.optional(MobySchemas.Int64),
        GraphDriver: Schema.NullOr(GraphDriverData.GraphDriverData),
        RootFS: Schema.NullOr(RootFS.RootFS),
        Metadata: Schema.NullOr(ImageMetadata.ImageMetadata),
    },
    {
        identifier: "ImageInspectResponse",
        title: "types.ImageInspect",
        documentation:
            "https://github.com/moby/moby/blob/733755d7cb18a4dbea7c290cc56e61d05502aca0/api/types/image/image_inspect.go#L14-L122",
    }
) {}
