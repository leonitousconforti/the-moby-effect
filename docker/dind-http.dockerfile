ARG DIND_BASE_IMAGE="docker.io/library/docker:dind-rootless@sha256:41825fb12da6b78219af4b862830f252be1f5dee3d6cbfd508736ed31c0014d8"
FROM ${DIND_BASE_IMAGE}

EXPOSE 2375
ENV DOCKER_TLS_CERTDIR=
CMD [ "--tls=false" ]
