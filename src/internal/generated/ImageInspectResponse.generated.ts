import * as EffectSchemas from "effect-schemas";
import * as Schema from "effect/Schema";
import * as MobyIdentifiers from "../schemas/id.ts";
import * as ContainerConfig from "./ContainerConfig.generated.js";
import * as ImageManifestSummary from "./ImageManifestSummary.generated.js";
import * as ImageMetadata from "./ImageMetadata.generated.js";
import * as ImageRootFS from "./ImageRootFS.generated.js";
import * as StorageDriverData from "./StorageDriverData.generated.js";
import * as V1Descriptor from "./V1Descriptor.generated.js";
import * as V1DockerOCIImageConfig from "./V1DockerOCIImageConfig.generated.js";

export class ImageInspectResponse extends Schema.Class<ImageInspectResponse>("ImageInspectResponse")(
    {
        Id: Schema.String,
        RepoTags: Schema.NullOr(Schema.Array(Schema.String)),
        RepoDigests: Schema.NullOr(Schema.Array(MobyIdentifiers.Digest)),
        Parent: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        Comment: Schema.String,
        Created: Schema.optional(Schema.String),
        Container: Schema.optional(Schema.String),
        ContainerConfig: Schema.optionalWith(ContainerConfig.ContainerConfig, { nullable: true }),
        DockerVersion: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        Author: Schema.optional(Schema.String), // optional for docker.io/library/docker:26-dind-rootless
        Config: Schema.NullOr(V1DockerOCIImageConfig.V1DockerOCIImageConfig),
        Architecture: Schema.String,
        Variant: Schema.optional(Schema.String),
        Os: Schema.String,
        OsVersion: Schema.optional(Schema.String),
        Size: EffectSchemas.Number.I64,
        VirtualSize: Schema.optional(EffectSchemas.Number.I64),
        GraphDriver: Schema.NullishOr(StorageDriverData.StorageDriverData), // optional for docker.io/library/docker:26-dind-rootless
        RootFS: Schema.NullOr(ImageRootFS.ImageRootFS),
        Metadata: Schema.NullOr(ImageMetadata.ImageMetadata),
        Descriptor: Schema.optionalWith(V1Descriptor.V1Descriptor, { nullable: true }),
        Manifests: Schema.optionalWith(Schema.Array(Schema.NullOr(ImageManifestSummary.ImageManifestSummary)), {
            nullable: true,
        }),
    },
    {
        identifier: "ImageInspectResponse",
        title: "image.InspectResponse",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/image#InspectResponse",
    }
) {}
