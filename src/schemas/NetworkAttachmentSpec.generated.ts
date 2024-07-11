import * as Schema from "@effect/schema/Schema";

export class NetworkAttachmentSpec extends Schema.Class<NetworkAttachmentSpec>("NetworkAttachmentSpec")({
    ContainerID: Schema.String,
}) {}
