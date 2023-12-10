FROM docker:dind

RUN \
    echo -n 'root:password' | chpasswd && \
    apk add --no-cache openssh-server && \
    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \
    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \
    sed -i 's/AllowTcpForwarding no/AllowTcpForwarding yes/g' /etc/ssh/sshd_config && \
    ssh-keygen -A

EXPOSE 22

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["/usr/local/bin/dockerd-entrypoint.sh & /usr/sbin/sshd -D"]
