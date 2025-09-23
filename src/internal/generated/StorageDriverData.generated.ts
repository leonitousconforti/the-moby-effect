import * as Schema from "effect/Schema";

export class StorageDriverData extends Schema.Class<StorageDriverData>("StorageDriverData")(
    {
        Data: Schema.NullOr(Schema.Record({ key: Schema.String, value: Schema.String })),
        Name: Schema.String,
    },
    {
        identifier: "StorageDriverData",
        title: "storage.DriverData",
        documentation: "",
    }
) {}
