declare module "stun" {
    import type dgram from "node:dgram";

    /**
     * These are all known STUN attributes, defined in RFC 5389 and elsewhere.
     *
     * @link https://tools.ietf.org/html/rfc5389#section-18.2
     */
    export const constants = {
        STUN_BINDING_REQUEST: 1,
        STUN_BINDING_INDICATION: 17,
        STUN_BINDING_RESPONSE: 257,
        STUN_BINDING_ERROR_RESPONSE: 273,
        STUN_ALLOCATE_REQUEST: 3,
        STUN_ALLOCATE_RESPONSE: 259,
        STUN_ALLOCATE_ERROR_RESPONSE: 275,
        STUN_REFRESH_REQUEST: 4,
        STUN_REFRESH_RESPONSE: 260,
        STUN_REFRESH_ERROR_RESPONSE: 276,
        STUN_SEND_INDICATION: 22,
        STUN_DATA_INDICATION: 23,
        STUN_CREATE_PERMISSION_REQUEST: 8,
        STUN_CREATE_PERMISSION_RESPONSE: 264,
        STUN_CREATE_PERMISSION_ERROR_RESPONSE: 280,
        STUN_CHANNEL_BIND_REQUEST: 9,
        STUN_CHANNEL_BIND_RESPONSE: 265,
        STUN_CHANNEL_BIND_ERROR_RESPONSE: 281,
        STUN_CODE_TRY_ALTERNATE: 300,
        STUN_CODE_BAD_REQUEST: 400,
        STUN_CODE_UNAUTHORIZED: 401,
        STUN_CODE_UNKNOWN_ATTRIBUTE: 420,
        STUN_CODE_STALE_CREDENTIALS: 430,
        STUN_CODE_STALE_NONCE: 438,
        STUN_CODE_SERVER_ERROR: 500,
        STUN_CODE_GLOBAL_FAILURE: 600,
        STUN_CODE_ROLE_CONFLICT: 487,
        STUN_CODE_FORBIDDEN: 403,
        STUN_CODE_ALLOCATION_MISMATCH: 437,
        STUN_CODE_WRONG_CREDENTIALS: 441,
        STUN_CODE_UNSUPPORTED_PROTOCOL: 442,
        STUN_CODE_ALLOCATION_QUOTA: 486,
        STUN_CODE_INSUFFICIENT_CAPACITY: 508,
        STUN_REASON_TRY_ALTERNATE: "Try Alternate Server",
        STUN_REASON_BAD_REQUEST: "Bad Request",
        STUN_REASON_UNAUTHORIZED: "Unauthorized",
        STUN_REASON_UNKNOWN_ATTRIBUTE: "Unknown Attribute",
        STUN_REASON_STALE_CREDENTIALS: "Stale Credentials",
        STUN_REASON_STALE_NONCE: "Stale Nonce",
        STUN_REASON_SERVER_ERROR: "Server Error",
        STUN_REASON_ROLE_CONFLICT: "Role Conflict",
        STUN_REASON_FORBIDDEN: "Forbidden",
        STUN_REASON_ALLOCATION_MISMATCH: "Allocation Mismatch",
        STUN_REASON_WRONG_CREDENTIALS: "Wrong Credentials",
        STUN_REASON_UNSUPPORTED_PROTOCOL: "Unsupported Transport Protocol",
        STUN_REASON_ALLOCATION_QUOTA: "Allocation Quota Reached",
        STUN_REASON_INSUFFICIENT_CAPACITY: "Insufficient Capacity",
        STUN_ATTR_MAPPED_ADDRESS: 1,
        STUN_ATTR_USERNAME: 6,
        STUN_ATTR_MESSAGE_INTEGRITY: 8,
        STUN_ATTR_ERROR_CODE: 9,
        STUN_ATTR_UNKNOWN_ATTRIBUTES: 10,
        STUN_ATTR_REALM: 20,
        STUN_ATTR_NONCE: 21,
        STUN_ATTR_XOR_MAPPED_ADDRESS: 32,
        STUN_ATTR_SOFTWARE: 32802,
        STUN_ATTR_ALTERNATE_SERVER: 32803,
        STUN_ATTR_FINGERPRINT: 32808,
        STUN_ATTR_ORIGIN: 32815,
        STUN_ATTR_RETRANSMIT_COUNT: 65280,
        STUN_ATTR_PRIORITY: 36,
        STUN_ATTR_USE_CANDIDATE: 37,
        STUN_ATTR_ICE_CONTROLLED: 32809,
        STUN_ATTR_ICE_CONTROLLING: 32810,
        STUN_ATTR_NOMINATION: 49153,
        STUN_ATTR_NETWORK_INFO: 49239,
        STUN_ATTR_CHANNEL_NUMBER: 12,
        STUN_ATTR_LIFETIME: 13,
        STUN_ATTR_XOR_PEER_ADDRESS: 18,
        STUN_ATTR_DATA: 19,
        STUN_ATTR_XOR_RELAYED_ADDRESS: 22,
        STUN_ATTR_EVEN_PORT: 24,
        STUN_ATTR_REQUESTED_TRANSPORT: 25,
        STUN_ATTR_DONT_FRAGMENT: 26,
        STUN_ATTR_RESERVATION_TOKEN: 34,
        STUN_ATTR_CHANGE_REQUEST: 3,
        STUN_ATTR_PADDING: 38,
        STUN_ATTR_RESPONSE_PORT: 39,
        STUN_ATTR_RESPONSE_ORIGIN: 32811,
        STUN_ATTR_OTHER_ADDRESS: 32812,
        STUN_EVENT_BINDING_REQUEST: "bindingRequest",
        STUN_EVENT_BINDING_INDICATION: "bindingIndication",
        STUN_EVENT_BINDING_RESPONSE: "bindingResponse",
        STUN_EVENT_BINDING_ERROR_RESPONSE: "bindingError",
    } as const;

    export class StunMessage {
        getXorAddress: () => { address: string };
        getAttribute: (type: (typeof constants)["STUN_ATTR_XOR_MAPPED_ADDRESS"]) => {
            /** Get attribute value. */
            value: {
                port: number;
                address: string;
                family: "IPv4" | "IPv6";
            };
        };
    }

    export function request(url: string, options?: { socket: dgram.Socket }): Promise<StunMessage>;
}
