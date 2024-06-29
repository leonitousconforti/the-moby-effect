import * as Schema from "@effect/schema/Schema";

/** https://github.com/moby/moby/blob/8b79278316b532d396048bc8c2fa015a85d53a53/api/types/network/network.go#L20-L24 */
export const Address = Schema.Struct({
    /** IP address. */
    Addr: Schema.String,
    /** Mask length of the IP address. */
    PrefixLen: Schema.Int,
});

export type Address = Schema.Schema.Type<typeof Address>;
export const AddressEncoded = Schema.encodedSchema(Address);
export type AddressEncoded = Schema.Schema.Encoded<typeof Address>;
