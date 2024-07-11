import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class UpdateOptions extends Schema.Class<UpdateOptions>("UpdateOptions")({
    Spec: MobySchemas.ClusterVolumeSpec,
}) {}
