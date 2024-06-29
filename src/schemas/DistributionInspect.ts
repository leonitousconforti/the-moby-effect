import { Schema as S } from "@effect/schema";

import { OCIDescriptor } from "./OCIDescriptor.js";
import { OCIPlatform } from "./OCIPlatform.js";

/**
 * Describes the result obtained from contacting the registry to retrieve image
 * metadata.
 */
export const DistributionInspect = S.Struct({
    Descriptor: OCIDescriptor,
    /** An array containing all platforms supported by the image. */
    Platforms: S.Array(OCIPlatform),
});

export type DistributionInspect = S.Schema.Type<typeof DistributionInspect>;
export const DistributionInspectEncoded = S.encodedSchema(DistributionInspect);
export type DistributionInspectEncoded = S.Schema.Encoded<typeof DistributionInspect>;
