import * as Schema from "effect/Schema";

export class SwarmServiceStatus extends Schema.Class<SwarmServiceStatus>("SwarmServiceStatus")(
    {
        RunningTasks: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        DesiredTasks: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
        CompletedTasks: Schema.BigIntFromString.check(Schema.isBetweenBigInt({ minimum: 0n, maximum: 2n ** 64n - 1n })),
    },
    {
        identifier: "SwarmServiceStatus",
        title: "swarm.ServiceStatus",
        documentation: "https://pkg.go.dev/github.com/docker/docker@v28.4.0+incompatible/api/types/swarm#ServiceStatus",
    }
) {}
