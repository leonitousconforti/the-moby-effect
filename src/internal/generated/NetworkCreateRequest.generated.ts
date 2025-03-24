import * as Schema from "effect/Schema";
import * as NetworkCreateOptions from "./NetworkCreateOptions.generated.js";

export class NetworkCreateRequest extends Schema.Class<NetworkCreateRequest>("NetworkCreateRequest")(
    {
        ...NetworkCreateOptions.NetworkCreateOptions.fields,
        Name: Schema.String,
        CheckDuplicate: Schema.optionalWith(Schema.Boolean, { nullable: true }),
    },
    {
        identifier: "NetworkCreateRequest",
        title: "network.CreateRequest",
        documentation:
            "https://github.com/moby/moby/blob/7d861e889cd2214b38c8f1f3f997bf003c77739d/api/types/network/network.go#L23-L30",
    }
) {}
