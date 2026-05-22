# Fastvm

Types:

- <code><a href="./src/resources/top-level.ts">HealthResponse</a></code>

Methods:

- <code title="get /healthz">client.<a href="./src/index.ts">health</a>() -> HealthResponse</code>

# Shared

Types:

- <code><a href="./src/resources/shared.ts">BucketMount</a></code>
- <code><a href="./src/resources/shared.ts">DNSMode</a></code>
- <code><a href="./src/resources/shared.ts">DNSPolicy</a></code>
- <code><a href="./src/resources/shared.ts">EgressPolicy</a></code>
- <code><a href="./src/resources/shared.ts">EgressRule</a></code>
- <code><a href="./src/resources/shared.ts">EgressRuleKind</a></code>
- <code><a href="./src/resources/shared.ts">FilePresignResponse</a></code>
- <code><a href="./src/resources/shared.ts">FirewallPolicy</a></code>
- <code><a href="./src/resources/shared.ts">IngressPolicy</a></code>
- <code><a href="./src/resources/shared.ts">IngressRule</a></code>
- <code><a href="./src/resources/shared.ts">IngressRuleKind</a></code>
- <code><a href="./src/resources/shared.ts">PolicyAction</a></code>
- <code><a href="./src/resources/shared.ts">VolumeAttachmentItem</a></code>

# Vms

Types:

- <code><a href="./src/resources/vms/vms.ts">ConsoleToken</a></code>
- <code><a href="./src/resources/vms/vms.ts">ExecResult</a></code>
- <code><a href="./src/resources/vms/vms.ts">Vm</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmListResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmDeleteResponse</a></code>
- <code><a href="./src/resources/vms/vms.ts">VmLaunchResponse</a></code>
- <code><a href="./src/lib/client.ts">ExecEvent</a></code>

Methods:

- <code title="get /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">retrieve</a>(id) -> Vm</code>
- <code title="patch /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">update</a>(id, { ...params }) -> Vm</code>
- <code title="get /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">list</a>({ ...params }) -> VmListResponse</code>
- <code title="delete /v1/vms/{id}">client.vms.<a href="./src/resources/vms/vms.ts">delete</a>(id) -> VmDeleteResponse</code>
- <code title="post /v1/vms/{id}/console-token">client.vms.<a href="./src/resources/vms/vms.ts">consoleToken</a>(id) -> ConsoleToken</code>
- <code title="post /v1/vms">client.vms.<a href="./src/resources/vms/vms.ts">launch</a>({ ...params }) -> VmLaunchResponse</code>
- <code title="patch /v1/vms/{id}/firewall">client.vms.<a href="./src/resources/vms/vms.ts">patchFirewall</a>(id, { ...params }) -> Vm</code>
- <code title="post /v1/vms/{id}/pause">client.vms.<a href="./src/resources/vms/vms.ts">pause</a>(id) -> Vm</code>
- <code title="post /v1/vms/{id}/ttl/refresh">client.vms.<a href="./src/resources/vms/vms.ts">refreshTtl</a>(id) -> Vm</code>
- <code title="post /v1/vms/{id}/resume">client.vms.<a href="./src/resources/vms/vms.ts">resume</a>(id) -> Vm</code>
- <code title="post /v1/vms/{id}/exec">client.vms.<a href="./src/resources/vms/vms.ts">run</a>(id, { ...params }) -> ExecResult</code>
- <code title="post /v1/vms/{id}/exec">client.vms.<a href="./src/lib/client.ts">stream</a>(id, { ...params }) -> AsyncIterable&lt;ExecEvent&gt;</code>
- <code title="put /v1/vms/{id}/firewall">client.vms.<a href="./src/resources/vms/vms.ts">setFirewall</a>(id, { ...params }) -> Vm</code>

## Services

Types:

- <code><a href="./src/resources/vms/services.ts">Service</a></code>
- <code><a href="./src/resources/vms/services.ts">ServiceListResponse</a></code>

Methods:

- <code title="put /v1/vms/{id}/services/{serviceName}">client.vms.services.<a href="./src/resources/vms/services.ts">update</a>(serviceName, { ...params }) -> Service</code>
- <code title="get /v1/vms/{id}/services">client.vms.services.<a href="./src/resources/vms/services.ts">list</a>(id) -> ServiceListResponse</code>
- <code title="delete /v1/vms/{id}/services/{serviceName}">client.vms.services.<a href="./src/resources/vms/services.ts">delete</a>(serviceName, { ...params }) -> void</code>
- <code title="post /v1/vms/{id}/services">client.vms.services.<a href="./src/resources/vms/services.ts">register</a>(id, { ...params }) -> Service</code>

## Files

Methods:

- <code title="post /v1/vms/{id}/files/fetch">client.vms.files.<a href="./src/resources/vms/files.ts">fetch</a>(id, { ...params }) -> ExecResult</code>
- <code title="post /v1/vms/{id}/files/presign">client.vms.files.<a href="./src/resources/vms/files.ts">presign</a>(id, { ...params }) -> FilePresignResponse</code>

## Volumes

Types:

- <code><a href="./src/resources/vms/volumes.ts">VolumeDetachResponse</a></code>

Methods:

- <code title="post /v1/vms/{id}/volumes">client.vms.volumes.<a href="./src/resources/vms/volumes.ts">attach</a>(id, { ...params }) -> VolumeAttachmentItem</code>
- <code title="delete /v1/vms/{id}/volumes/{volumeId}">client.vms.volumes.<a href="./src/resources/vms/volumes.ts">detach</a>(volumeID, { ...params }) -> VolumeDetachResponse</code>

## BucketMounts

Types:

- <code><a href="./src/resources/vms/bucket-mounts.ts">BucketMountListResponse</a></code>

Methods:

- <code title="get /v1/vms/{id}/bucket-mounts/{bucketMountId}">client.vms.bucketMounts.<a href="./src/resources/vms/bucket-mounts.ts">retrieve</a>(bucketMountID, { ...params }) -> BucketMount</code>
- <code title="get /v1/vms/{id}/bucket-mounts">client.vms.bucketMounts.<a href="./src/resources/vms/bucket-mounts.ts">list</a>(id) -> BucketMountListResponse</code>
- <code title="delete /v1/vms/{id}/bucket-mounts/{bucketMountId}">client.vms.bucketMounts.<a href="./src/resources/vms/bucket-mounts.ts">delete</a>(bucketMountID, { ...params }) -> void</code>
- <code title="post /v1/vms/{id}/bucket-mounts">client.vms.bucketMounts.<a href="./src/resources/vms/bucket-mounts.ts">attach</a>(id, { ...params }) -> BucketMount</code>
- <code title="patch /v1/vms/{id}/bucket-mounts/{bucketMountId}">client.vms.bucketMounts.<a href="./src/resources/vms/bucket-mounts.ts">rotate</a>(bucketMountID, { ...params }) -> BucketMount</code>

# Me

## SSHKeys

Types:

- <code><a href="./src/resources/me/ssh-keys.ts">SSHKey</a></code>
- <code><a href="./src/resources/me/ssh-keys.ts">SSHKeyListResponse</a></code>
- <code><a href="./src/resources/me/ssh-keys.ts">SSHKeyDeleteResponse</a></code>

Methods:

- <code title="get /v1/me/ssh-keys">client.me.sshKeys.<a href="./src/resources/me/ssh-keys.ts">list</a>() -> SSHKeyListResponse</code>
- <code title="delete /v1/me/ssh-keys/{fingerprint}">client.me.sshKeys.<a href="./src/resources/me/ssh-keys.ts">delete</a>(fingerprint) -> SSHKeyDeleteResponse</code>
- <code title="post /v1/me/ssh-keys">client.me.sshKeys.<a href="./src/resources/me/ssh-keys.ts">add</a>({ ...params }) -> SSHKey</code>

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

# SnapshotImports

Types:

- <code><a href="./src/resources/snapshot-imports.ts">ContextPresignResponse</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportEvent</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportResponse</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportSourceSpec</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportSourceView</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportListResponse</a></code>
- <code><a href="./src/resources/snapshot-imports.ts">SnapshotImportDeleteResponse</a></code>

Methods:

- <code title="post /v1/snapshot-imports">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">create</a>({ ...params }) -> SnapshotImportResponse</code>
- <code title="get /v1/snapshot-imports/{id}">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">retrieve</a>(id) -> SnapshotImportResponse</code>
- <code title="get /v1/snapshot-imports">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">list</a>() -> SnapshotImportListResponse</code>
- <code title="delete /v1/snapshot-imports/{id}">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">delete</a>(id) -> SnapshotImportDeleteResponse</code>
- <code title="post /v1/snapshot-imports/{id}/cancel">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">cancel</a>(id) -> SnapshotImportResponse</code>
- <code title="post /v1/snapshot-imports/context-presign">client.snapshotImports.<a href="./src/resources/snapshot-imports.ts">presignContext</a>({ ...params }) -> ContextPresignResponse</code>

# Quotas

Types:

- <code><a href="./src/resources/quotas.ts">OrgQuotaUsage</a></code>
- <code><a href="./src/resources/quotas.ts">OrgQuotaValues</a></code>

Methods:

- <code title="get /v1/org/quotas">client.quotas.<a href="./src/resources/quotas.ts">retrieve</a>() -> OrgQuotaUsage</code>

# Volumes

Types:

- <code><a href="./src/resources/volumes.ts">Volume</a></code>
- <code><a href="./src/resources/volumes.ts">VolumeListResponse</a></code>
- <code><a href="./src/resources/volumes.ts">VolumeDeleteResponse</a></code>
- <code><a href="./src/resources/volumes.ts">VolumeListAttachmentsResponse</a></code>

Methods:

- <code title="post /v1/volumes">client.volumes.<a href="./src/resources/volumes.ts">create</a>({ ...params }) -> Volume</code>
- <code title="get /v1/volumes/{id}">client.volumes.<a href="./src/resources/volumes.ts">retrieve</a>(id) -> Volume</code>
- <code title="patch /v1/volumes/{id}">client.volumes.<a href="./src/resources/volumes.ts">update</a>(id, { ...params }) -> Volume</code>
- <code title="get /v1/volumes">client.volumes.<a href="./src/resources/volumes.ts">list</a>() -> VolumeListResponse</code>
- <code title="delete /v1/volumes/{id}">client.volumes.<a href="./src/resources/volumes.ts">delete</a>(id) -> VolumeDeleteResponse</code>
- <code title="get /v1/volumes/{id}/attachments">client.volumes.<a href="./src/resources/volumes.ts">listAttachments</a>(id) -> VolumeListAttachmentsResponse</code>
