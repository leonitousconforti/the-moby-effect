import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "./MobySchemas.js";

export class ReplicatedService extends Schema.Class<ReplicatedService>("ReplicatedService")({
    Replicas: MobySchemas.UInt64,
}) {}
