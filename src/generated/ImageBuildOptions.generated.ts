import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as MobySchemasGenerated from "./index.js";

export class ImageBuildOptions extends Schema.Class<ImageBuildOptions>("ImageBuildOptions")(
    {
        Tags: Schema.NullOr(Schema.Array(Schema.String)),
        SuppressOutput: Schema.NullOr(Schema.Boolean),
        RemoteContext: Schema.NullOr(Schema.String),
        NoCache: Schema.NullOr(Schema.Boolean),
        Remove: Schema.NullOr(Schema.Boolean),
        ForceRemove: Schema.NullOr(Schema.Boolean),
        PullParent: Schema.NullOr(Schema.Boolean),
        Isolation: Schema.NullOr(Schema.String),
        CPUSetCPUs: Schema.NullOr(Schema.String),
        CPUSetMems: Schema.NullOr(Schema.String),
        CPUShares: Schema.NullOr(MobySchemas.Int64),
        CPUQuota: Schema.NullOr(MobySchemas.Int64),
        CPUPeriod: Schema.NullOr(MobySchemas.Int64),
        Memory: Schema.NullOr(MobySchemas.Int64),
        MemorySwap: Schema.NullOr(MobySchemas.Int64),
        CgroupParent: Schema.NullOr(Schema.String),
        NetworkMode: Schema.NullOr(Schema.String),
        ShmSize: Schema.NullOr(MobySchemas.Int64),
        Dockerfile: Schema.NullOr(Schema.String),
        Ulimits: Schema.NullOr(Schema.Array(MobySchemasGenerated.Ulimit)),
        BuildArgs: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        AuthConfigs: Schema.NullOr(Schema.Record(Schema.String, MobySchemasGenerated.AuthConfig)),
        Context: Schema.Object,
        Labels: Schema.NullOr(Schema.Record(Schema.String, Schema.String)),
        Squash: Schema.NullOr(Schema.Boolean),
        CacheFrom: Schema.NullOr(Schema.Array(Schema.String)),
        SecurityOpt: Schema.NullOr(Schema.Array(Schema.String)),
        ExtraHosts: Schema.NullOr(Schema.Array(Schema.String)),
        Target: Schema.NullOr(Schema.String),
        SessionID: Schema.NullOr(Schema.String),
        Platform: Schema.NullOr(Schema.String),
        Version: Schema.NullOr(Schema.String),
        BuildID: Schema.NullOr(Schema.String),
        Outputs: Schema.NullOr(Schema.Array(MobySchemasGenerated.ImageBuildOutput)),
    },
    {
        identifier: "ImageBuildOptions",
        title: "types.ImageBuildOptions",
    }
) {}
