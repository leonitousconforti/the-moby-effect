import { Schema as S } from "@effect/schema";

import { PortBinding } from "./PortBinding.js";

/**
 * PortMap describes the mapping of container ports to host ports, using the
 * container's port-number and protocol as key in the format
 * `<port>/<protocol>`, for example, `80/udp`.
 *
 * If a container's port is mapped for multiple protocols, separate entries are
 * added to the mapping table.
 */
export const PortMap = S.Record(S.String, S.Array(PortBinding));
export type PortMap = S.Schema.Type<typeof PortMap>;
export const PortMapEncoded = S.encodedSchema(PortMap);
export type PortMapEncoded = S.Schema.Encoded<typeof PortMap>;
