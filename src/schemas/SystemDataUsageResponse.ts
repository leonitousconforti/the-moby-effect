// export class SystemDataUsageResponse extends Schema.Class<SystemDataUsageResponse>("SystemDataUsageResponse")({
//     LayersSize: Schema.optional(Schema.Number),
//     Images: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ImageSummary)))),
//     Containers: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(ContainerSummary)))),
//     Volumes: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(Volume)))),
//     BuildCache: Schema.optional(Schema.NullOr(Schema.Array(Schema.NullOr(BuildCache)))),
// }) {}

import { Schema as S } from "@effect/schema";

// FIXME: This is a placeholder. Update this type with the correct schema.
export const SystemDataUsageResponse = S.Struct({
    /** The status of the authentication */
    Status: S.String,

    /** An opaque token used to authenticate a user after a successful login */
    IdentityToken: S.optional(S.String),
});

export type SystemDataUsageResponse = S.Schema.Type<typeof SystemDataUsageResponse>;
export const SystemDataUsageResponseEncoded = S.encodedSchema(SystemDataUsageResponse);
export type SystemDataUsageResponseEncoded = S.Schema.Encoded<typeof SystemDataUsageResponse>;
