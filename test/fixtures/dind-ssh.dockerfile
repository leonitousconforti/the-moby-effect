ARG DIND_BASE_IMAGE="docker.io/library/docker:dind-rootless@sha256:eb151b0f024b9d46ecd6eeafb45ea85ff87855c1129ad3c6bc7daac1de5d100f"
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
