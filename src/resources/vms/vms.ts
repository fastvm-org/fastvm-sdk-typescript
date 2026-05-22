// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as BucketMountsAPI from './bucket-mounts';
import {
  BucketMountAttachParams,
  BucketMountDeleteParams,
  BucketMountListResponse,
  BucketMountRetrieveParams,
  BucketMountRotateParams,
  BucketMounts,
} from './bucket-mounts';
import * as FilesAPI from './files';
import { FileFetchParams, FilePresignParams, Files } from './files';
import * as ServicesAPI from './services';
import {
  Service,
  ServiceDeleteParams,
  ServiceListResponse,
  ServiceRegisterParams,
  ServiceUpdateParams,
  Services,
} from './services';
import * as VolumesAPI from './volumes';
import { VolumeAttachParams, VolumeDetachParams, VolumeDetachResponse, Volumes } from './volumes';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Vms extends APIResource {
  services: ServicesAPI.Services = new ServicesAPI.Services(this._client);
  files: FilesAPI.Files = new FilesAPI.Files(this._client);
  volumes: VolumesAPI.Volumes = new VolumesAPI.Volumes(this._client);
  bucketMounts: BucketMountsAPI.BucketMounts = new BucketMountsAPI.BucketMounts(this._client);

  /**
   * Get a VM
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Vm> {
    return this._client.get(path`/v1/vms/${id}`, options);
  }

  /**
   * Renames a VM and/or replaces its metadata map. At least one of `name` or
   * `metadata` must be provided. Sending `metadata: {}` clears all metadata;
   * omitting `metadata` leaves it unchanged.
   */
  update(id: string, body: VmUpdateParams, options?: RequestOptions): APIPromise<Vm> {
    return this._client.patch(path`/v1/vms/${id}`, { body, ...options });
  }

  /**
   * Lists all non-deleted VMs for the authenticated org. Supports metadata-equality
   * filtering; callers pass repeated query parameters of the form
   * `metadata.<key>=<value>` (e.g. `metadata.env=prod&metadata.role=api`). The
   * optional `status` query filter narrows by lifecycle status (e.g.
   * `?status=paused`).
   */
  list(query: VmListParams | null | undefined = {}, options?: RequestOptions): APIPromise<VmListResponse> {
    return this._client.get('/v1/vms', { query, ...options });
  }

  /**
   * Delete a VM
   */
  delete(id: string, options?: RequestOptions): APIPromise<VmDeleteResponse> {
    return this._client.delete(path`/v1/vms/${id}`, options);
  }

  /**
   * Returns a short-lived token and WebSocket path. Open a WebSocket to
   * `wss://<host><websocketPath>?session=<token>` to attach to the VM's serial
   * console. The WebSocket endpoint itself is intentionally not modeled in this spec
   * because it uses a capability-URL flow (no API key on upgrade) and a custom
   * binary/text protocol. See `src/fastvm/lib/console.py` in the Python SDK for a
   * reference client.
   */
  consoleToken(id: string, options?: RequestOptions): APIPromise<ConsoleToken> {
    return this._client.post(path`/v1/vms/${id}/console-token`, options);
  }

  /**
   * Creates a new VM, either from a machineType (fresh boot) or a snapshotId
   * (restore from snapshot).
   *
   * - Returns **201** when the VM is already running in the response.
   * - Returns **202** when the VM is queued; clients must poll `GET /v1/vms/{id}`
   *   until status transitions to `running`. Terminal failure statuses are `error`
   *   and `stopped`.
   *
   * The SDK's `launch()` helper handles the 201/202 branching and polling
   * automatically.
   */
  launch(body: VmLaunchParams, options?: RequestOptions): APIPromise<VmLaunchResponse> {
    return this._client.post('/v1/vms', { body, maxRetries: 0, ...options });
  }

  /**
   * Updates one or more blocks of the firewall policy. Each top-level block
   * (`ingress`, `egress`, `dns`) is optional; when present, the supplied object
   * **replaces that block wholesale**. Per-rule diffing is not supported — to change
   * a single rule, send the full block with the desired rule list. An empty body
   * (`{}`) is a no-op.
   *
   * Examples:
   *
   * - `{"ingress": {"default": "deny", "rules": []}}` clears all ingress rules and
   *   sets the default action.
   * - `{"dns": {"mode": "allow", "domains": ["api.example.com"], "blockBypass": true}}`
   *   updates only the DNS block.
   */
  patchFirewall(id: string, body: VmPatchFirewallParams, options?: RequestOptions): APIPromise<Vm> {
    return this._client.patch(path`/v1/vms/${id}/firewall`, { body, ...options });
  }

  /**
   * Captures the VM state, frees the worker and all customer-facing quotas, and
   * transitions the VM to `paused`. Idempotent on already-paused VMs (returns 200
   * with the current state). Synchronous; ~3 s end-to-end.
   */
  pause(id: string, options?: RequestOptions): APIPromise<Vm> {
    return this._client.post(path`/v1/vms/${id}/pause`, options);
  }

  /**
   * Resets the TTL countdown to a fresh `seconds` budget. From `running`, the
   * deadline moves to `now + seconds*1000`. From `paused`, the remaining-budget is
   * reset to `seconds*1000` and takes effect on next resume. 409 if no TTL is
   * configured.
   */
  refreshTtl(id: string, options?: RequestOptions): APIPromise<Vm> {
    return this._client.post(path`/v1/vms/${id}/ttl/refresh`, options);
  }

  /**
   * Restores the VM's prior state, re-acquires quota, and transitions to `running`.
   * Sync-when-fast / async-when-queued: returns 200 if the VM is running inline, or
   * 202 if queued for cluster capacity. Idempotent on already-running.
   */
  resume(id: string, options?: RequestOptions): APIPromise<Vm> {
    return this._client.post(path`/v1/vms/${id}/resume`, options);
  }

  /**
   * Runs `command` inside the VM. Response shape is determined by the client's
   * `Accept` header:
   *
   * - **`Accept: application/json`** (default, omitted, or `* /*`): buffered
   *   `ExecVMResponse` — the server collects all output and returns a single JSON
   *   object once the command exits. Per-stream output is capped at 4 MiB; overflow
   *   bytes are dropped and signalled via `stdoutTruncated` / `stderrTruncated`.
   * - **`Accept: application/x-ndjson`**: newline-delimited stream of `ExecEvent`s —
   *   zero or more `stdout`/`stderr` chunks followed by exactly one terminal `exit`
   *   event. Use this for incremental output (long builds, test runners, live logs).
   *   No server-side cap.
   *
   * Both modes share the same request body. `timeoutSec` bounds server-side
   * execution; clients should set their own HTTP timeout in addition.
   *
   * 502 responses are transient (the upstream VM host is unreachable or returned an
   * error). The SDK's `run()` helper does NOT auto-retry these by default: exec is
   * **not idempotent**, so if a 502 hides a successful exec a retry may run the
   * command twice. Callers opt in with `max_retries=N` per call.
   */
  run(id: string, body: VmRunParams, options?: RequestOptions): APIPromise<ExecResult> {
    return this._client.post(path`/v1/vms/${id}/exec`, { body, maxRetries: 0, ...options });
  }

  /**
   * Replaces the full firewall policy on a VM.
   */
  setFirewall(id: string, body: VmSetFirewallParams, options?: RequestOptions): APIPromise<Vm> {
    return this._client.put(path`/v1/vms/${id}/firewall`, { body, ...options });
  }
}

export interface ConsoleToken {
  token: string;

  expiresInSec: number;

  /**
   * Relative WebSocket path; combine with your API host as
   * `wss://<host><websocketPath>?session=<token>`.
   */
  websocketPath: string;
}

/**
 * Buffered response shape for `POST /v1/vms/{id}/exec` under
 * `Accept: application/json`. The server collects the streamed events and returns
 * this aggregate once the command exits. Per-stream output is capped at 4 MiB;
 * overflow bytes are dropped and signalled via `stdoutTruncated` /
 * `stderrTruncated`. Streaming clients (`Accept: application/x-ndjson`) receive
 * every byte without a cap.
 */
export interface ExecResult {
  durationMs: number;

  exitCode: number;

  stderr: string;

  /**
   * True if the collector dropped stderr bytes past the 4 MiB cap.
   */
  stderrTruncated: boolean;

  stdout: string;

  /**
   * True if the collector dropped stdout bytes past the 4 MiB cap.
   */
  stdoutTruncated: boolean;

  timedOut: boolean;
}

export interface Vm {
  id: string;

  cpu: number;

  createdAt: string;

  diskGiB: number;

  memoryMiB: number;

  name: string;

  orgId: string;

  /**
   * Lifecycle status. Known values: `provisioning`, `running`, `stopped`, `pausing`,
   * `paused`, `resuming`, `deleting`, `error`. Terminal failure statuses are `error`
   * and `stopped`; transitional values (`provisioning`, `pausing`, `resuming`,
   * `deleting`) indicate the VM is in flight. Additional values may be introduced in
   * future server versions; clients should treat unknown values as "in transition"
   * rather than as hard errors.
   */
  status: string;

  /**
   * Currently-attached bucket-mounts on this VM.
   */
  bucketMounts?: Array<Shared.BucketMount>;

  deletedAt?: string | null;

  /**
   * Top-level firewall policy with three independent axes. All sub-blocks are
   * optional — the server substitutes the safe default (ingress deny / egress allow
   * / dns mode=deny + empty) for missing blocks. Sending `firewall: null` on VM
   * create is also valid.
   */
  effectiveFirewall?: Shared.FirewallPolicy;

  /**
   * Environment variable string→string map injected into the VM at boot. Keys must
   * be 1–256 bytes and match shell-variable name (`[A-Za-z_][A-Za-z0-9_]*`); values
   * may not contain newline, carriage return, or null bytes. Total JSON encoding
   * ≤65536 bytes.
   */
  envVars?: { [key: string]: string };

  /**
   * Absolute timestamp in ms when the TTL fires. Set only while the VM is `running`
   * (the countdown freezes on pause).
   */
  expiresAtMs?: number;

  /**
   * Top-level firewall policy with three independent axes. All sub-blocks are
   * optional — the server substitutes the safe default (ingress deny / egress allow
   * / dns mode=deny + empty) for missing blocks. Sending `firewall: null` on VM
   * create is also valid.
   */
  firewall?: Shared.FirewallPolicy;

  machineName?: string;

  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  /**
   * When the VM became paused; null otherwise.
   */
  pausedAt?: string | null;

  publicIpv6?: string;

  /**
   * Source snapshot or image name (empty on fresh boot).
   */
  sourceName?: string;

  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  ttl?: Vm.Ttl | null;

  /**
   * Remaining cycle budget in ms. Set only while the VM is paused; restored to
   * `expiresAtMs` on resume.
   */
  ttlRemainingMs?: number;

  /**
   * Currently-attached volumes on this VM.
   */
  volumes?: Array<Shared.VolumeAttachmentItem>;
}

export namespace Vm {
  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  export interface Ttl {
    /**
     * Action taken on expiry. `pause` re-arms the cycle for the next running session;
     * `delete` is terminal.
     */
    action: 'pause' | 'delete';

    /**
     * Cycle duration. Refresh resets to this value. Capped at 1 year (31536000s);
     * larger values are rejected with 400.
     */
    seconds: number;
  }
}

export type VmListResponse = Array<Vm>;

export interface VmDeleteResponse {
  id: string;

  deleted: boolean;
}

/**
 * VM object as returned by `POST /v1/vms`. On snapshot restore, an optional
 * `snapshotRestoreWarnings` field may be present if the captured services failed
 * to re-register on the new VM. Existing SDK callers that don't know about the
 * field see the unchanged VM wire shape (`omitempty` keeps the field absent on
 * cold boots and on warning-free restores).
 */
export interface VmLaunchResponse extends Vm {
  attachmentWarnings?: VmLaunchResponse.AttachmentWarnings;

  /**
   * Reports best-effort failures during the snapshot-restore service-replay step.
   * Only present when restoring from a snapshot AND the post-create bulk service
   * registration failed. The VM is created successfully and usable; the user can
   * manually re-register the listed services with one `POST /v1/vms/{id}/services`
   * per service.
   *
   * Bulk service registration is atomic at Redis (one Lua call either writes all-N
   * entries or zero), so partial state ("5 of 8 registered") is impossible — the
   * response is always either a VM with all services registered or a VM with zero
   * services and the full list returned here.
   */
  snapshotRestoreWarnings?: VmLaunchResponse.SnapshotRestoreWarnings;
}

export namespace VmLaunchResponse {
  export interface AttachmentWarnings {
    failedBucketMountAttachments?: Array<AttachmentWarnings.FailedBucketMountAttachment>;

    failedVolumeAttachments?: Array<AttachmentWarnings.FailedVolumeAttachment>;

    skippedSnapshotBucketMounts?: Array<AttachmentWarnings.SkippedSnapshotBucketMount>;

    skippedSnapshotVolumes?: Array<AttachmentWarnings.SkippedSnapshotVolume>;
  }

  export namespace AttachmentWarnings {
    export interface FailedBucketMountAttachment {
      bucketUri: string;

      mountPath: string;

      statusMessage: string;
    }

    export interface FailedVolumeAttachment {
      mountPath: string;

      statusMessage: string;

      volumeId: string;
    }

    export interface SkippedSnapshotBucketMount {
      bucketUri: string;

      mountPath: string;

      /**
       * Known values: `credentials_invalid`, `bucket_unreachable`,
       * `credentials_unavailable`.
       */
      reason: string;
    }

    export interface SkippedSnapshotVolume {
      mountPath: string;

      /**
       * Known values: `deleted`, `deleting`, `cross_org`, `vol_ro_ceiling_after_patch`.
       */
      reason: string;

      volumeId: string;
    }
  }

  /**
   * Reports best-effort failures during the snapshot-restore service-replay step.
   * Only present when restoring from a snapshot AND the post-create bulk service
   * registration failed. The VM is created successfully and usable; the user can
   * manually re-register the listed services with one `POST /v1/vms/{id}/services`
   * per service.
   *
   * Bulk service registration is atomic at Redis (one Lua call either writes all-N
   * entries or zero), so partial state ("5 of 8 registered") is impossible — the
   * response is always either a VM with all services registered or a VM with zero
   * services and the full list returned here.
   */
  export interface SnapshotRestoreWarnings {
    /**
     * Always `true` when this object is present.
     */
    servicesRegistrationFailed: boolean;

    /**
     * Operator-facing diagnostic for the failure.
     */
    reason?: string;

    /**
     * Services from the snapshot that did not land on the new VM. Caller can
     * re-register each via `POST /v1/vms/{id}/services`.
     */
    unregisteredServices?: Array<SnapshotRestoreWarnings.UnregisteredService>;
  }

  export namespace SnapshotRestoreWarnings {
    /**
     * Captured (name, port, h2c) tuple for a single service registration on a
     * snapshotted VM. Carried across snapshot/ restore by `POST /v1/vms`
     * (snapshot-restore branch) so the new VM gets the same service registrations the
     * source VM had at snapshot time.
     */
    export interface UnregisteredService {
      name: string;

      port: number;

      h2c?: boolean;
    }
  }
}

export interface VmUpdateParams {
  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  name?: string;

  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  ttl?: VmUpdateParams.Ttl | null;
}

export namespace VmUpdateParams {
  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  export interface Ttl {
    /**
     * Action taken on expiry. `pause` re-arms the cycle for the next running session;
     * `delete` is terminal.
     */
    action: 'pause' | 'delete';

    /**
     * Cycle duration. Refresh resets to this value. Capped at 1 year (31536000s);
     * larger values are rejected with 400.
     */
    seconds: number;
  }
}

export interface VmListParams {
  /**
   * Restrict to VMs with this status. Accepts any value of `VMStatus`; unknown
   * values return an empty list.
   */
  status?: string;
}

export interface VmLaunchParams {
  /**
   * Cold-boot inline bucket-mounts. Same authoritative-replace semantics on snapshot
   * restore.
   */
  bucketMounts?: Array<VmLaunchParams.BucketMount>;

  /**
   * Override the default disk size (GiB).
   */
  diskGiB?: number;

  /**
   * Environment variable string→string map injected into the VM at boot. Keys must
   * be 1–256 bytes and match shell-variable name (`[A-Za-z_][A-Za-z0-9_]*`); values
   * may not contain newline, carriage return, or null bytes. Total JSON encoding
   * ≤65536 bytes.
   */
  envVars?: { [key: string]: string };

  /**
   * Top-level firewall policy with three independent axes. All sub-blocks are
   * optional — the server substitutes the safe default (ingress deny / egress allow
   * / dns mode=deny + empty) for missing blocks. Sending `firewall: null` on VM
   * create is also valid.
   */
  firewall?: Shared.FirewallPolicy;

  /**
   * Machine size identifier (e.g. `c1m2`, `c2m4`). Controls CPU and memory
   * allocation. Must be supplied on launch unless restoring from a snapshot.
   */
  machineType?: string;

  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  /**
   * User-facing name (trimmed + whitespace-collapsed, max 64 runes after
   * normalization; longer values are truncated server-side). Auto-generated as
   * `vm-<8-char-id-prefix>` if empty.
   */
  name?: string;

  /**
   * Snapshot ID to restore from.
   */
  snapshotId?: string;

  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  ttl?: VmLaunchParams.Ttl;

  /**
   * Cold-boot inline volume attachments (managed Volume IDs). On snapshot restore,
   * this list authoritatively replaces the captured list. Omit to use the captured
   * list.
   */
  volumes?: Array<VmLaunchParams.Volume>;
}

export namespace VmLaunchParams {
  export interface BucketMount {
    /**
     * Customer's GCS or S3 bucket URI. `gs://<bucket>[/prefix]` or
     * `s3://<bucket>[/prefix]`.
     */
    bucketUri: string;

    /**
     * Customer-provided credentials. Never returned in API responses. Discriminated
     * union: the `type` property selects the per-provider shape so SDKs surface typed
     * per-type values.
     */
    credentials: BucketMount.GcpServiceAccountCredentials | BucketMount.AwsCredentials;

    mountPath: string;

    readOnly?: boolean;
  }

  export namespace BucketMount {
    export interface GcpServiceAccountCredentials {
      type: 'gcp-service-account-json';

      value: GcpServiceAccountCredentials.Value;
    }

    export namespace GcpServiceAccountCredentials {
      export interface Value {
        client_email: string;

        private_key: string;

        type: 'service_account';
      }
    }

    export interface AwsCredentials {
      type: 'aws-credentials';

      value: AwsCredentials.Value;
    }

    export namespace AwsCredentials {
      export interface Value {
        /**
         * AWS shared-credentials INI text. Must contain a `[default]` section with
         * `aws_access_key_id` and `aws_secret_access_key`.
         */
        data: string;
      }
    }
  }

  /**
   * Per-VM auto-action timer. The cycle ticks down while the VM is `running` and
   * freezes on pause. `seconds` is the original cycle duration; refresh and
   * PATCH-time updates reset to this value.
   */
  export interface Ttl {
    /**
     * Action taken on expiry. `pause` re-arms the cycle for the next running session;
     * `delete` is terminal.
     */
    action: 'pause' | 'delete';

    /**
     * Cycle duration. Refresh resets to this value. Capped at 1 year (31536000s);
     * larger values are rejected with 400.
     */
    seconds: number;
  }

  export interface Volume {
    /**
     * Absolute path; must start with /mnt/ or /data/.
     */
    mountPath: string;

    volumeId: string;

    readOnly?: boolean;
  }
}

export interface VmPatchFirewallParams {
  /**
   * DNS-layer filtering, independent of egress L4 rules. The resolver applies the
   * DNS gate BEFORE L4 enforcement; a domain blocked here returns NXDOMAIN
   * regardless of what egress.rules says about its IPs. All fields are optional —
   * the server defaults `mode` to `deny` when missing, `domains` to `[]`, and
   * `blockBypass` to false (see `normalizeDNSPolicy` in
   * `scheduler/internal/httpapi/firewall.go`).
   */
  dns?: Shared.DNSPolicy;

  egress?: Shared.EgressPolicy;

  ingress?: Shared.IngressPolicy;
}

export interface VmRunParams {
  /**
   * Argv-style command. First element must be non-empty. For shell strings, wrap as
   * `["sh", "-c", "<string>"]`.
   */
  command: Array<string>;

  /**
   * Optional base64-encoded stdin blob, written to the child's stdin before the
   * process starts reading much and then closed. Streaming stdin is not supported —
   * pipe from a file inside the guest if you need that shape.
   */
  stdin?: string;

  /**
   * Server-side execution timeout in seconds. Must be positive when provided; omit
   * to use the server default.
   */
  timeoutSec?: number;
}

export interface VmSetFirewallParams {
  /**
   * DNS-layer filtering, independent of egress L4 rules. The resolver applies the
   * DNS gate BEFORE L4 enforcement; a domain blocked here returns NXDOMAIN
   * regardless of what egress.rules says about its IPs. All fields are optional —
   * the server defaults `mode` to `deny` when missing, `domains` to `[]`, and
   * `blockBypass` to false (see `normalizeDNSPolicy` in
   * `scheduler/internal/httpapi/firewall.go`).
   */
  dns?: Shared.DNSPolicy;

  egress?: Shared.EgressPolicy;

  ingress?: Shared.IngressPolicy;
}

Vms.Services = Services;
Vms.Files = Files;
Vms.Volumes = Volumes;
Vms.BucketMounts = BucketMounts;

export declare namespace Vms {
  export {
    type ConsoleToken as ConsoleToken,
    type ExecResult as ExecResult,
    type Vm as Vm,
    type VmListResponse as VmListResponse,
    type VmDeleteResponse as VmDeleteResponse,
    type VmLaunchResponse as VmLaunchResponse,
    type VmUpdateParams as VmUpdateParams,
    type VmListParams as VmListParams,
    type VmLaunchParams as VmLaunchParams,
    type VmPatchFirewallParams as VmPatchFirewallParams,
    type VmRunParams as VmRunParams,
    type VmSetFirewallParams as VmSetFirewallParams,
  };

  export {
    Services as Services,
    type Service as Service,
    type ServiceListResponse as ServiceListResponse,
    type ServiceUpdateParams as ServiceUpdateParams,
    type ServiceDeleteParams as ServiceDeleteParams,
    type ServiceRegisterParams as ServiceRegisterParams,
  };

  export {
    Files as Files,
    type FileFetchParams as FileFetchParams,
    type FilePresignParams as FilePresignParams,
  };

  export {
    Volumes as Volumes,
    type VolumeDetachResponse as VolumeDetachResponse,
    type VolumeAttachParams as VolumeAttachParams,
    type VolumeDetachParams as VolumeDetachParams,
  };

  export {
    BucketMounts as BucketMounts,
    type BucketMountListResponse as BucketMountListResponse,
    type BucketMountRetrieveParams as BucketMountRetrieveParams,
    type BucketMountDeleteParams as BucketMountDeleteParams,
    type BucketMountAttachParams as BucketMountAttachParams,
    type BucketMountRotateParams as BucketMountRotateParams,
  };
}
