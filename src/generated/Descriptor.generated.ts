import * as Schema from "@effect/schema/Schema";
import * as MobySchemas from "../schemas/index.js";
import * as Platform from "./Platform.generated.js";

export class Descriptor extends Schema.Class<Descriptor>("Descriptor")(
    {
        mediaType: Schema.String,

        /** https://github.com/opencontainers/go-digest/blob/22b78e47854adc56477927aba5f4c930b56af8c9/digest.go#L65 */
        digest: Schema.String.pipe(Schema.pattern(/^[a-z0-9]+(?:[.+_-][a-z0-9]+)*:[a-zA-Z0-9=_-]+$/)),

        size: MobySchemas.Int64,
        urls: Schema.optionalWith(Schema.Array(Schema.String), { nullable: true }),
        annotations: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
        data: Schema.optionalWith(Schema.Array(MobySchemas.UInt8), { nullable: true }),
        platform: Schema.optionalWith(Platform.Platform, { nullable: true }),
        artifactType: Schema.optional(Schema.String),
    },
    {
        identifier: "Descriptor",
        title: "v1.Descriptor",
        documentation:
            "https://github.com/opencontainers/image-spec/blob/39ab2d54cfa8fe1bee1ff20001264986d92ab85a/specs-go/v1/descriptor.go#L19-L50",
    }
) {}
