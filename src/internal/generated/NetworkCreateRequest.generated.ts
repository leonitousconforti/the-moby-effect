import * as Schema from "effect/Schema";

import * as NetworkCreateOptions from "./NetworkCreateOptions.generated.ts";

export class NetworkCreateRequest extends Schema.Class<NetworkCreateRequest>("NetworkCreateRequest")(
    {
        ...NetworkCreateOptions.NetworkCreateOptions.fields,
        Name: Schema.String,
        CheckDuplicate: Schema.optional(Schema.NullOr(Schema.Boolean)),
    },
    {
        identifier: "NetworkCreateRequest",
        title: "network.CreateRequest",
        documentation:
            "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/network#CreateRequest",
    }
) {}
