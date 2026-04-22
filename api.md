# Fastvm

Types:

- <code><a href="./src/resources/top-level.ts">HealthResponse</a></code>

Methods:

- <code title="get /healthz">client.<a href="./src/index.ts">health</a>() -> HealthResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">FirewallPolicy</a></code>
- <code><a href="./src/resources/shared.ts">FirewallRule</a></code>

# Vms

Types:

- <code><a href="./src/resources/vms/vms.ts">ConsoleToken</a></code>
- <code><a href="./src/resources/vms/vms.ts">ExecResult</a></code>
- <code><a href="./src/resources/vms/vms.ts">Vm</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmListResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmDeleteResponse</a></code>

Methods:

- <code title="get /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">retrieve</a>(id) -> Vm</code>
- <code title="patch /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">update</a>(id, { ...params }) -> Vm</code>
- <code title="get /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">list</a>() -> VmListResponse</code>
- <code title="delete /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">delete</a>(id) -> VmDeleteResponse</code>
- <code title="post /v1/vms/{id}/console-token">client.vms.<a href="./src/resources/vms/vms.ts">consoleToken</a>(id) -> ConsoleToken</code>
- <code title="post /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">launch</a>({ ...params }) -> Vm</code>
- <code title="patch /v1/vms/{id}/firewall">client.vms.<a href="./src/resources/vms/vms.ts">patchFirewall</a>(id, { ...params }) -> Vm</code>
- <code title="post /v1/vms/{id}/exec">client.vms.<a href="./src/resources/vms/vms.ts">run</a>(id, { ...params }) -> ExecResult</code>
- <code title="put /v1/vms/{id}/firewall">client.vms.<a href="./src/resources/vms/vms.ts">setFirewall</a>(id, { ...params }) -> Vm</code>

## Files

Types:

- <code><a href="./src/resources/vms/files.ts">PresignResponse</a></code>

Methods:

- <code title="post /v1/vms/{id}/files/fetch">client.vms.files.<a href="./src/resources/vms/files.ts">fetch</a>(id, { ...params }) -> ExecResult</code>
- <code title="post /v1/vms/{id}/files/presign">client.vms.files.<a href="./src/resources/vms/files.ts">presign</a>(id, { ...params }) -> PresignResponse</code>

# Snapshots

Types:

- <code><a href="./src/resources/snapshots.ts">Snapshot</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotListResponse</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotDeleteResponse</a></code>

Methods:

- <code title="post /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">create</a>({ ...params }) -> Snapshot</code>
- <code title="patch /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">update</a>(id, { ...params }) -> Snapshot</code>
- <code title="get /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">list</a>() -> SnapshotListResponse</code>
- <code title="delete /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">delete</a>(id) -> SnapshotDeleteResponse</code>

# Quotas

Types:

- <code><a href="./src/resources/quotas.ts">OrgQuotaUsage</a></code>
- <code><a href="./src/resources/quotas.ts">OrgQuotaValues</a></code>

Methods:

- <code title="get /v1/org/quotas">client.quotas.<a href="./src/resources/quotas.ts">retrieve</a>() -> OrgQuotaUsage</code>

# Helpers

Hand-written convenience methods on top of the generated `Fastvm` client.
Source: [`src/lib/`](./src/lib/). Full docs: [`helpers.md`](./helpers.md).

Import the helper-enhanced client via the top-level export:

```ts
import { FastvmClient, VMLaunchError, VMNotReadyError, FileTransferError } from 'fastvm';
const client = new FastvmClient();
```

All helper errors subclass `FastvmError` — `catch (e) { if (e instanceof FastvmError) ... }` catches every SDK error.

Methods:

- <code>client.<a href="./src/lib/client.ts">launch</a>(params, opts?) -> Promise&lt;<a href="./src/resources/vms/vms.ts">Vm</a>&gt;</code>
- <code>client.<a href="./src/lib/client.ts">waitForVmReady</a>(vmId, opts?) -> Promise&lt;<a href="./src/resources/vms/vms.ts">Vm</a>&gt;</code>
- <code>client.<a href="./src/lib/client.ts">upload</a>(vmId, localPath, remotePath, opts?) -> Promise&lt;void&gt;</code>
- <code>client.<a href="./src/lib/client.ts">download</a>(vmId, remotePath, localPath, opts?) -> Promise&lt;void&gt;</code>
