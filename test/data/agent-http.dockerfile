FROM docker:dind

EXPOSE 2375
ENV DOCKER_TLS_CERTDIR=
CMD [ "--tls=false" ]
