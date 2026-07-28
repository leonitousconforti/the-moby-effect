# TODO

## Codegen

- [ ] rework go reflection for type generation

## Undici transport

The undici http client can not set the `Connection: Upgrade` / `Upgrade: tcp`
headers required to hijack a connection, which disables exec, attach, and
sessions on that transport.

- [ ] `src/internal/endpoints/execs.ts:124` - exec start upgrade headers are
      broken on undici
- [ ] `src/internal/endpoints/containers.ts:572` - container attach upgrade
      headers are broken on undici
- [ ] `test/session.test.ts:10` - session tests are skipped for every undici
      platform variant (`node-22.x-undici`, `node-24.x-undici`,
      `node-26.x-undici`, `deno-undici`, `bun-undici`)
- [ ] `test/exec.test.ts:46` - `exec` test bails out early under
      `DindEngine.layerUndici`
- [ ] `test/exec.test.ts:78` - `execWebsocketsNonBlocking` hangs on undici over
      the ssh tunnel (works on http/https/socket, verified in ci run 29949801595)

## Response hijacking

- [ ] `src/MobyDemux.ts:475` - `hijackResponseUnsafe` relies on a hack to reach
      the underlying tcp socket; NodeJs only, untested on Bun/Deno, will never
      work in the browser
- [ ] `src/MobyDemux.ts:491` - `responseToStreamingSocketOrFailUnsafe` has the
      same hack and the same platform limits

## Platforms

- [ ] `src/MobyPlatforms.ts:54` - `makeDenoHttpClientLayer` is just an alias for
      the Node layer (`src/internal/platforms/deno.ts`), pending
      https://github.com/denoland/deno/issues/21436

## Engine internals

- [ ] `src/internal/engines/docker.ts:338` - decide whether the exec websocket
      semaphore `release` should be uninterruptible

## Test matrix

- [ ] `test/exec.test.ts:68` - `execWebsocketsNonBlocking` hangs on
      `docker:26-dind-rootless` and `docker:27-dind-rootless` across every
      transport (verified in ci run 29949801595)

## Dependencies

- [ ] `patches/effect@4.0.0-beta.102.patch` - carrying a local patch that adds
      `StreamUint8Array` payload handling to `HttpApiClient` /
      `HttpApiEndpoint`; upstream it and drop the patch. Still not fixed as of
      beta.102, and the version-pinned `patchedDependencies` key means every
      effect bump must retarget this patch or `pnpm install` breaks.
