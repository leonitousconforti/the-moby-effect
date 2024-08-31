---
title: blobs/Ssh.ts
nav_order: 7
parent: Modules
---

## Ssh overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [Blobs](#blobs)
  - [content](#content)

---

# Blobs

## content

**Signature**

```ts
export declare const content: 'ARG DIND_BASE_IMAGE\nFROM ${DIND_BASE_IMAGE}\n\nRUN \\\n    echo -n \'root:password\' | chpasswd && \\\n    apk update && apk upgrade && apk add openssh-server && \\\n    echo "PermitRootLogin yes" >> /etc/ssh/sshd_config && \\\n    echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config && \\\n    sed -i \'s/AllowTcpForwarding no/AllowTcpForwarding yes/g\' /etc/ssh/sshd_config && \\\n    ssh-keygen -A\n\nEXPOSE 22\nENTRYPOINT ["/bin/sh", "-c"]\nCMD ["/usr/local/bin/dockerd-entrypoint.sh & /usr/sbin/sshd -D"]\n'
```

Added in v1.0.0
