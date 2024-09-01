/**
 * Socket docker content
 *
 * @since 1.0.0
 */

import * as BlobConstants from "../blobs/Constants.js";

/**
 * @since 1.0.0
 * @category Blobs
 */
export const content = `ARG DIND_BASE_IMAGE="${BlobConstants.DefaultDindBaseImage}"
FROM \${DIND_BASE_IMAGE}
`;
