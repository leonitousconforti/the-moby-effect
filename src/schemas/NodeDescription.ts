import { Schema as S } from "@effect/schema";

import { EngineDescription } from "./EngineDescription.js";
import { Platform } from "./Platform.js";
import { ResourceObject } from "./ResourceObject.js";
import { TLSInfo } from "./TLSInfo.js";

/**
 * NodeDescription encapsulates the properties of the Node as reported by the
 * agent.
 */
export const NodeDescription = S.Struct({
    Hostname: S.optional(S.String),
    Platform: S.optional(Platform),
    Resources: S.optional(ResourceObject),
    Engine: S.optional(EngineDescription),
    TLSInfo: S.optional(TLSInfo),
});

export type NodeDescription = S.Schema.Type<typeof NodeDescription>;
export const NodeDescriptionEncoded = S.encodedSchema(NodeDescription);
export type NodeDescriptionEncoded = S.Schema.Encoded<typeof NodeDescription>;
