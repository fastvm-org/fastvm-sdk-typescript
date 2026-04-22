# Fastvm TypeScript helpers

The auto-generated `README.md` covers the generated SDK surface (every REST
method, authentication, errors, retries, timeouts, logging, pagination, raw
HTTP, versioning). This file documents everything that sits **on top of**
the generated client — a small set of hand-written ergonomic helpers under
[`src/lib/`](src/lib/), re-exported from the top-level `fastvm` package.

See [`fastvm-mono/CUSTOM_CODE.md`](https://github.com/fastvm-org/fastvm-mono/blob/main/CUSTOM_CODE.md)
for the rationale and the full inventory across both SDKs.

```ts
import { FastvmClient } from 'fastvm';
const client = new FastvmClient(); // same constructor/options as `Fastvm`
```

`FastvmClient` extends `Fastvm` — every generated method/resource works
identically. The list below is exhaustive: one signature override on the
generated `vms.launch`, plus a handful of top-level helpers.

## `client.vms.launch(params, options?, launchOpts?)` — poll until `status === 'running'`

`FastvmClient` swaps in a `Vms` subclass that overrides `launch()` to
poll `GET /v1/vms/{id}` until the VM is ready. `POST /v1/vms` returns
`201` for immediately-running VMs and `202` for queued VMs; the override
handles both paths transparently.

```ts
const vm = await client.vms.launch({ machineType: 'c1m2', name: 'dev' });
// throws VMLaunchError on terminal status (error / stopped / deleting)
// throws VMNotReadyError on polling timeout

const vm = await client.vms.launch({ snapshotId: 'snp_...' }); // restore-from-snapshot

const vm = await client.vms.launch(params, undefined, { wait: false });
// wait:false → returns the initial (possibly-queued) VM immediately
```

The first two arguments match the generated `Vms.launch(body, options?)`
signature byte-for-byte. Helper-only options live on the third argument:

- `wait` (default `true`) — skip polling and return the raw 201/202 body.
- `pollIntervalMs` (default `2000`) — poll cadence with ±10% jitter.
- `timeoutMs` (default `300_000`) — total deadline before `VMNotReadyError`.

`client.waitForVmReady(vmId, opts?)` is exposed separately for callers who
already have a VM id (e.g. from `client.vms.list()`).

## `client.upload(vmId, localPath, remotePath, opts?)`

Unified file/dir upload over the existing presigned-URL primitives
(`vms.files.presign` + `vms.files.fetch` + `vms.run`). Dispatches on
`fs.stat(localPath)`:

- **File** → `presign` → streamed `PUT` to the signed URL → VM `fetch`.
- **Directory** → `presign` → client pipes `tar -cz -C <dir> .` into a
  streamed `PUT` → VM `fetch` the tarball to `/var/tmp` → VM
  `mkdir -p <remote> && tar -xzf … -C <remote> && rm -f …`.

```ts
await client.upload(vm.id, './src', '/root/src');
await client.upload(vm.id, './config.toml', '/etc/app.toml');
```

## `client.download(vmId, remotePath, localPath, opts?)`

Unified file/dir download. Runs `test -d` VM-side first to classify the
remote path; missing paths throw a `FileTransferError` with `code: 'ENOENT'`.

- **File** → `presign` → VM `curl -T <remote> <uploadUrl>` → client
  streams `downloadUrl` into `localPath`.
- **Directory** → `presign` → VM `tar -cz -C <remote> . | curl -T - <uploadUrl>` →
  client pipes `downloadUrl` through `tar -xz -C <localDir>`.

```ts
await client.download(vm.id, '/root/out.log', './out.log');
await client.download(vm.id, '/var/log', './logs-back');
```

Directory uploads/downloads require the `tar` binary on the client's
`PATH` (standard on macOS/Linux and on modern Windows via bsdtar).

Transfer options (both upload + download):

- `fetchTimeoutSec` (default `600`) — timeout on the VM-side
  `/files/fetch` call.
- `execTimeoutSec` (default `600`) — timeout on the VM-side `tar` / `curl`
  exec.

Both helpers stream end-to-end — no intermediate copy to `/tmp` on the
client side — so multi-GB transfers are bounded by VM disk, not RAM.

If you need manual control over the signed-URL flow, the raw resource is
fully documented in `api.md`:

```ts
const presign = await client.vms.files.presign(vmId, { path: '/root/x' });
// ...roll your own PUT / GET / fetch...
```

## Error types

Every SDK error — generated HTTP errors *and* the three helper errors
below — subclasses the same `FastvmError` root:

```ts
import { FastvmError } from 'fastvm'; // catches everything SDK-raised
```

The three helper-only errors cover failure modes the generated `APIError`
hierarchy can't model (success HTTP response with a failure payload,
client-side polling deadlines, out-of-band GCS / local-tar failures):

```ts
import { VMLaunchError, VMNotReadyError, FileTransferError } from 'fastvm';
```

- `VMLaunchError` — VM reached a terminal failure status (`error` /
  `stopped` / `deleting`) during `launch()` polling. Not an HTTP error;
  `GET /v1/vms/{id}` returned 200 OK with a bad status in the body.
  Exposes `.vmId` and `.status`.
- `VMNotReadyError` — `launch()` / `waitForVmReady()` polling deadline
  exceeded. Exposes `.vmId`, `.lastStatus`, `.timeoutMs`.
- `FileTransferError` — any failure during `upload()` / `download()` that
  isn't a Fastvm HTTP error: GCS PUT/GET failures, local `fs`/`tar` errors,
  size-limit violations, or VM-side `tar` / `curl` exits. When the failure
  came from a VM-side exec, the underlying `ExecResult` is attached as
  `.execResult` — inspect `.execResult.stderr` / `.execResult.exitCode`.

Regular HTTP 4xx/5xx from any method (helpers or generated) still surfaces
as `APIError` / `NotFoundError` / `RateLimitError` / `AuthenticationError`
etc., untouched.

## What's intentionally missing (vs. the Python SDK)

- **CLI** — Python only.
- **Shell-string auto-wrap on `vms.run`** — TypeScript doesn't silently
  iterate strings into characters, so this Python footgun doesn't exist.
- **HTTP/2 by default** — Node's native `fetch` (undici) negotiates HTTP/2
  automatically where the server supports it; no client config needed.
