import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import * as SwarmSpec from "./SwarmSpec.generated.ts";

export class SwarmInitRequest extends Schema.Class<SwarmInitRequest>("SwarmInitRequest")(
    {
        ListenAddr: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed("0.0.0.0:2377"))),
        AdvertiseAddr: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        DataPathAddr: Schema.String.pipe(Schema.withConstructorDefault(Effect.succeed(""))),
        DataPathPort: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })).pipe(Schema.withConstructorDefault(Effect.succeed(0))),
        ForceNewCluster: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        Spec: Schema.NullOr(SwarmSpec.SwarmSpec).pipe(Schema.withConstructorDefault(Effect.succeed(null))),
        AutoLockManagers: Schema.Boolean.pipe(Schema.withConstructorDefault(Effect.succeed(false))),
        Availability: Schema.Literals(["active", "pause", "drain"]).pipe(Schema.withConstructorDefault(Effect.succeed("active"))),
        DefaultAddrPool: Schema.NullOr(Schema.Array(Schema.String)).pipe(Schema.withConstructorDefault(Effect.succeed([]))),
        SubnetSize: Schema.NumberFromString.check(Schema.isInt(), Schema.isBetween({ minimum: 0, maximum: 2 ** 32 - 1 })).pipe(Schema.withConstructorDefault(Effect.succeed(24))),
    },
    {
        identifier: "SwarmInitRequest",
        title: "swarm.InitRequest",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#InitRequest",
    }
) {}
