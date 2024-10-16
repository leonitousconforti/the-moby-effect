/**
 * Ssh docker content
 *
 * @since 1.0.0
 */

import * as BlobConstants from "./Constants.js";

/**
 * @since 1.0.0
 * @category Blobs
 */
export const content = `ARG DIND_BASE_IMAGE="${BlobConstants.DefaultDindBaseImage}"
FROM \${DIND_BASE_IMAGE}
USER root

RUN \\
    echo -n 'root:password' | chpasswd && \\
    apk update && apk upgrade && apk add openssh-server && \\
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \\
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \\
    sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/g' /etc/ssh/sshd_config && \\
    ssh-keygen -A

EXPOSE 22
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/usr/local/bin/dockerd-entrypoint.sh & /usr/sbin/sshd -D"]
`;
