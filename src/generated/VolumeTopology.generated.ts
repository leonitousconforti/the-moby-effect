import * as Schema from "effect/Schema";

export class VolumeTopology extends Schema.Class<VolumeTopology>("VolumeTopology")(
    {
        // A topological domain is a sub-division of a cluster, like "region",
        // "zone", "rack", etc.
        // A topological segment is a specific instance of a topological domain,
        // like "zone3", "rack3", etc.
        // For example {"com.company/zone": "Z1", "com.company/rack": "R3"}
        // Valid keys have two segments: an OPTIONAL prefix and name, separated
        // by a slash (/), for example: "com.company.example/zone".
        // The key name segment is REQUIRED. The prefix is OPTIONAL.
        // The key name MUST be 63 characters or less, begin and end with an
        // alphanumeric character ([a-z0-9A-Z]), and contain only dashes (-),
        // underscores (_), dots (.), or alphanumerics in between, for example
        // "zone".
        // The key prefix MUST be 63 characters or less, begin and end with a
        // lower-case alphanumeric character ([a-z0-9]), contain only
        // dashes (-), dots (.), or lower-case alphanumerics in between, and
        // follow domain name notation format
        // (https://tools.ietf.org/html/rfc1035#section-2.3.1).
        // The key prefix SHOULD include the plugin's host company name and/or
        // the plugin name, to minimize the possibility of collisions with keys
        // from other plugins.
        // If a key prefix is specified, it MUST be identical across all
        // topology keys returned by the SP (across all RPCs).
        // Keys MUST be case-insensitive. Meaning the keys "Zone" and "zone"
        // MUST not both exist.
        // Each value (topological segment) MUST contain 1 or more strings.
        // Each string MUST be 63 characters or less and begin and end with an
        // alphanumeric character with '-', '_', '.', or alphanumerics in
        // between.
        Segments: Schema.optionalWith(
            Schema.Record({
                key: Schema.String,
                value: Schema.String,
            }),
            { nullable: true }
        ),
    },
    {
        identifier: "VolumeTopology",
        title: "volume.Topology",
        documentation:
            "https://github.com/moby/moby/blob/a21b1a2d12e2c01542cb191eb526d7bfad0641e3/api/types/volume/cluster_volume.go#L301-L335",
    }
) {}
