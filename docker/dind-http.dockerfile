ARG DIND_BASE_IMAGE="docker.io/library/docker:dind"
FROM ${DIND_BASE_IMAGE}

EXPOSE 2375
ENV DOCKER_TLS_CERTDIR=
CMD [ "--tls=false" ]
