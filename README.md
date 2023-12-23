# the-moby-effect

Moby/Docker Daemon API client built using [effect-ts](http://effect.website). If you want documentation, please consider reading [The Docker API documentation](https://docs.docker.com/engine/api/latest), it is very well written and there is nothing in this library that wouldn't be in there (plus I would just do a worse job if I tried to write my interpretation of their documentation here). If you are just looking for some examples to get your feet underneath you quickly with effect integration, then I do have some of those [here](./examples/).

## Goals

- [x] - local unix socket connections
- [x] - http and https connections
- [x] - ssh connections
- [x] - streaming (just like [dockerode](https://github.com/apocas/dockerode), streams are passed directly through to you)
- [x] - tests, examples, and in-line JSDoc comments based on the docker api documentation
- [x] - Strong focus on types and typescript support

## Todo/Future
- Finish unit tests
- Add more examples
- Maybe test against something else other than docker as well?

## Non-Goals

- Tighter schema: the moby/docker api schema is pretty loose - almost nothing is explicitly marked as required and object properties are optional by default under the swagger2.0/openapi specification. I have no intention to try to tighten their schema in my project. If the moby schema doesn't explicitly mark it as a required field, then it will be optional.

- Version negotiating: either install a specific version for the moby/docker daemon that you are targeting or just keep your docker install somewhat up-to-date and you should have no problems

## Versioning

This package does not follow semantic versioning, instead the major and minor part represents the version the of docker api from the moby repository that this was based on, can also be found [here](https://docs.docker.com/engine/api/version-history/). All bugfixes, breaking or otherwise, will be released under an incremented patch version.

## Contributing

Contributions and suggestions are welcome! To test your changes run:

1. `pnpm install`
2. `pnpm build`
