
ARG DIND_BASE_IMAGE="docker.io/library/docker:dind-rootless@sha256:eb151b0f024b9d46ecd6eeafb45ea85ff87855c1129ad3c6bc7daac1de5d100f"
FROM ${DIND_BASE_IMAGE}

EXPOSE 2375
ENV DOCKER_TLS_CERTDIR=
CMD [ "--tls=false" ]
