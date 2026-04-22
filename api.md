# Healthz

Methods:

- <code title="get /healthz">client.healthz.<a href="./src/resources/healthz.ts">check</a>() -> void</code>

# Livez

Methods:

- <code title="get /livez">client.livez.<a href="./src/resources/livez.ts">check</a>() -> void</code>

# Readyz

Methods:

- <code title="get /readyz">client.readyz.<a href="./src/resources/readyz.ts">check</a>() -> void</code>

# Vms

Types:

- <code><a href="./src/resources/vms/vms.ts">DeleteResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmInstance</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmListResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmExecuteCommandResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmIssueConsoleTokenResponse</a></code>

Methods:

- <code title="post /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">create</a>({ ...params }) -> VmInstance</code>
- <code title="get /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">retrieve</a>(id) -> VmInstance</code>
- <code title="get /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">list</a>() -> VmListResponse</code>
- <code title="delete /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">delete</a>(id) -> DeleteResponse</code>
- <code title="post /v1/vms/{id}/exec">client.vms.<a href="./src/resources/vms/vms.ts">executeCommand</a>(id, { ...params }) -> VmExecuteCommandResponse</code>
- <code title="post /v1/vms/{id}/console-token">client.vms.<a href="./src/resources/vms/vms.ts">issueConsoleToken</a>(id) -> VmIssueConsoleTokenResponse</code>
- <code title="patch /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">rename</a>(id, { ...params }) -> VmInstance</code>

## Firewall

Types:

- <code><a href="./src/resources/vms/firewall.ts">FirewallPolicy</a></code>
- <code><a href="./src/resources/vms/firewall.ts">FirewallRule</a></code>

Methods:

- <code title="patch /v1/vms/{id}/firewall">client.vms.firewall.<a href="./src/resources/vms/firewall.ts">patchPolicy</a>(id, { ...params }) -> VmInstance</code>
- <code title="put /v1/vms/{id}/firewall">client.vms.firewall.<a href="./src/resources/vms/firewall.ts">replacePolicy</a>(id, { ...params }) -> VmInstance</code>

## Console

Methods:

- <code title="get /v1/vms/{id}/console/ws">client.vms.console.<a href="./src/resources/vms/console.ts">websocket</a>(id, { ...params }) -> void</code>

# Snapshots

Types:

- <code><a href="./src/resources/snapshots.ts">SnapshotObject</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotListResponse</a></code>

Methods:

- <code title="post /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">create</a>({ ...params }) -> SnapshotObject</code>
- <code title="patch /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">update</a>(id, { ...params }) -> SnapshotObject</code>
- <code title="get /v1/snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">list</a>() -> SnapshotListResponse</code>
- <code title="delete /v1/snapshots/{id}">client.snapshots.<a href="./src/resources/snapshots.ts">delete</a>(id) -> DeleteResponse</code>

# Org

Types:

- <code><a href="./src/resources/org.ts">OrgQuotaValues</a></code>
- <code><a href="./src/resources/org.ts">OrgRetrieveQuotasResponse</a></code>

Methods:

- <code title="get /v1/org/quotas">client.org.<a href="./src/resources/org.ts">retrieveQuotas</a>() -> OrgRetrieveQuotasResponse</code>
