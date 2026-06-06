ARG DIND_BASE_IMAGE="docker.io/library/docker:dind-rootless@sha256:41825fb12da6b78219af4b862830f252be1f5dee3d6cbfd508736ed31c0014d8"
FROM ${DIND_BASE_IMAGE}
USER root

RUN \
    echo -n 'root:password' | chpasswd && \
    apk update && apk upgrade && apk add openssh-server && \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \
    sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/g' /etc/ssh/sshd_config && \
    ssh-keygen -A

EXPOSE 22
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/usr/local/bin/dockerd-entrypoint.sh & /usr/sbin/sshd -D"]
