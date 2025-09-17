import * as Schema from "effect/Schema";

export class DriverData extends Schema.Class<DriverData>("DriverData")(
    {
        Data: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Name: Schema.String,
    },
    {
        identifier: "DriverData",
        title: "storage.DriverData",
        documentation: "",
    }
) {}
