import * as Schema from "effect/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as Descriptor from "./Descriptor.generated.js";
import * as DriverData from "./DriverData.generated.js";
import * as ImageMetadata from "./ImageMetadata.generated.js";
import * as ManifestSummary from "./ManifestSummary.generated.js";
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
        GraphDriver: Schema.NullOr(DriverData.DriverData),
        RootFS: Schema.NullOr(RootFS.RootFS),
        Metadata: Schema.NullOr(ImageMetadata.ImageMetadata),
        Descriptor: Schema.optionalWith(Descriptor.Descriptor, { nullable: true }),
        Manifests: Schema.optionalWith(Schema.Array(Schema.NullOr(ManifestSummary.ManifestSummary)), {
            nullable: true,
        }),
    },
    {
        identifier: "ImageInspectResponse",
        title: "image.InspectResponse",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/image/image_inspect.go#L15-L141",
    }
) {}
