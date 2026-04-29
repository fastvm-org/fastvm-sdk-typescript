# Fastvm

Types:

- <code><a href="./src/resources/top-level.ts">HealthResponse</a></code>

Methods:

- <code title="get /healthz">client.<a href="./src/index.ts">health</a>() -> HealthResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">FilePresignResponse</a></code>
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

Methods:

- <code title="post /v1/vms/{id}/files/fetch">client.vms.files.<a href="./src/resources/vms/files.ts">fetch</a>(id, { ...params }) -> ExecResult</code>
- <code title="post /v1/vms/{id}/files/presign">client.vms.files.<a href="./src/resources/vms/files.ts">presign</a>(id, { ...params }) -> FilePresignResponse</code>

# Snapshots

Types:

- <code><a href="./src/resources/snapshots.ts">Snapshot</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotListResponse</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotDeleteResponse</a></code>

Methods:

- <code title="post /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">create</a>({ ...params }) -> Snapshot</code>
- <code title="get /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">retrieve</a>(id) -> Snapshot</code>
- <code title="patch /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">update</a>(id, { ...params }) -> Snapshot</code>
- <code title="get /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">list</a>() -> SnapshotListResponse</code>
- <code title="delete /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">delete</a>(id) -> SnapshotDeleteResponse</code>

# Builds

Types:

- <code><a href="./src/resources/builds.ts">BuildResponse</a></code>

Methods:

- <code title="post /v1/builds">client.builds.<a href="./src/resources/builds.ts">create</a>({ ...params }) -> BuildResponse</code>
- <code title="get /v1/builds/{id}">client.builds.<a href="./src/resources/builds.ts">retrieve</a>(id) -> BuildResponse</code>

# BuildContexts

Methods:

- <code title="post /v1/build-contexts/presign">client.buildContexts.<a href="./src/resources/build-contexts.ts">presign</a>() -> FilePresignResponse</code>

# Quotas

Types:

- <code><a href="./src/resources/quotas.ts">OrgQuotaUsage</a></code>
- <code><a href="./src/resources/quotas.ts">OrgQuotaValues</a></code>

Methods:

- <code title="get /v1/org/quotas">client.quotas.<a href="./src/resources/quotas.ts">retrieve</a>() -> OrgQuotaUsage</code>
