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
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/network/network.go#L23-L30",
    }
) {}
