# the-moby-effect

Moby/Docker API client built using [effect-ts](effect.website). Docker uses the naming convention NounVerb for their endpoints and I am sticking with that here. If you want documentation, please consider reading [The Docker API documentation](https://docs.docker.com/engine/api/latest), it is very well written and there is nothing in this library that wouldn't be in there (plus I would just do a worse job if I tried to write my interpretation of their documentation here). If you are just looking for some examples to get your feet underneath you quickly, then I do have some of those [here](./examples/).

## Features

- [x] - local unix socket connections
- [x] - http and https connections
- [x] - ssh connections
- [x] - streaming (just like [dockerode](https://github.com/apocas/dockerode), streams are passed directly through to you)
- [x] - tests

## Versioning

This package does not follow semantic versioning, instead the major and minor part represents the version the of docker api from the moby repository that this was based on, can also be found [here](https://docs.docker.com/engine/api/version-history/). All bugfixes, breaking or otherwise, will be released under an incremented patch version.

## Contributing

Contributions and suggestions are welcome! To test your changes run:

1. `pnpm install`
2. `pnpm build`
