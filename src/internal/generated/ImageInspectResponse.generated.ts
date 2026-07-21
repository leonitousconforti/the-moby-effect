import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ContainerConfig from "./ContainerConfig.generated.ts";
import * as ImageManifestSummary from "./ImageManifestSummary.generated.ts";
import * as ImageMetadata from "./ImageMetadata.generated.ts";
import * as ImageRootFS from "./ImageRootFS.generated.ts";
import * as StorageDriverData from "./StorageDriverData.generated.ts";
import * as V1Descriptor from "./V1Descriptor.generated.ts";
import * as V1DockerOCIImageConfig from "./V1DockerOCIImageConfig.generated.ts";

export class ImageInspectResponse extends Schema.Class<ImageInspectResponse>("ImageInspectResponse")(
    {
        Id: MobyIdentifiers.ImageIdentifier,
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        RepoDigests: Schema.NullOr(Schema.Array(MobyIdentifiers.Digest)),
        Parent: Schema.String,
        Comment: Schema.String,
        Created: Schema.optional(Schema.String),
        Container: Schema.optional(Schema.String),
        ContainerConfig: Schema.optional(Schema.NullOr(ContainerConfig.ContainerConfig)),
        DockerVersion: Schema.String,
        Author: Schema.String,
        Config: Schema.NullOr(V1DockerOCIImageConfig.V1DockerOCIImageConfig),
        Architecture: Schema.String,
        Variant: Schema.optional(Schema.String),
        Os: Schema.String,
        OsVersion: Schema.optional(Schema.String),
        Size: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n })),
        VirtualSize: Schema.optional(Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: -(2n ** 63n), maximum: 2n ** 63n - 1n }))),
        GraphDriver: Schema.NullOr(StorageDriverData.StorageDriverData),
        RootFS: Schema.NullOr(ImageRootFS.ImageRootFS),
        Metadata: Schema.NullOr(ImageMetadata.ImageMetadata),
        Descriptor: Schema.optional(Schema.NullOr(V1Descriptor.V1Descriptor)),
        Manifests: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ImageManifestSummary.ImageManifestSummary)))),
    },
    {
        identifier: "ImageInspectResponse",
        title: "image.InspectResponse",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#InspectResponse",
    }
) {}
