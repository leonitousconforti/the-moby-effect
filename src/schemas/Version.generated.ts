import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class Version extends Schema.Class<Version>("Version")({
    Components: Schema.Array(MobySchemas.ComponentVersion),
    Version: Schema.String,
    APIVersion: Schema.String,
    MinAPIVersion: Schema.String,
    GitCommit: Schema.String,
    GoVersion: Schema.String,
    Os: Schema.String,
    Arch: Schema.String,
    KernelVersion: Schema.String,
    Experimental: Schema.Boolean,
    BuildTime: Schema.String,
}) {}
