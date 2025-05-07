import * as Schema from "effect/Schema";

export class DriverData extends Schema.Class<DriverData>("DriverData")(
    {
        Data: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Name: Schema.String,
    },
    {
        identifier: "DriverData",
        title: "storage.DriverData",
        documentation:
            "https://github.com/moby/moby/blob/453c165be709d294ab744f2efbd2552b338bb1a0/api/types/storage/driver_data.go#L6-L23",
    }
) {}
