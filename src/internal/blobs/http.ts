import * as BlobConstants from "./constants.js";

/** @internal */
export const content = /* dockerfile */ `
ARG DIND_BASE_IMAGE="${BlobConstants.DefaultDindBaseImage}"
FROM \${DIND_BASE_IMAGE}

EXPOSE 2375
ENV DOCKER_TLS_CERTDIR=
CMD [ "--tls=false" ]
`;
