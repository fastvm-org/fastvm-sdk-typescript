// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as FilesAPI from './files';
import { FileFetchParams, FilePresignParams, Files, PresignResponse } from './files';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Vms extends APIResource {
  files: FilesAPI.Files = new FilesAPI.Files(this._client);

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
   * `metadata.<key>=<value>` (e.g. `metadata.env=prod&metadata.role=api`).
   */
  list(options?: RequestOptions): APIPromise<VmListResponse> {
    return this._client.get('/v1/vms', options);
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
   * — it uses a capability-URL flow (no API key on upgrade) and a custom binary/text
   * protocol. See `src/fastvm/lib/console.py` in the Python SDK for a reference
   * client.
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
  launch(body: VmLaunchParams, options?: RequestOptions): APIPromise<Vm> {
    return this._client.post('/v1/vms', { body, maxRetries: 0, ...options });
  }

  /**
   * Updates `mode` and/or `ingress` on the firewall policy. Passing `ingress: []`
   * clears all rules; omitting `ingress` leaves rules unchanged.
   */
  patchFirewall(id: string, body: VmPatchFirewallParams, options?: RequestOptions): APIPromise<Vm> {
    return this._client.patch(path`/v1/vms/${id}/firewall`, { body, ...options });
  }

  /**
   * Runs a command via the VM's guest agent and returns stdout, stderr, exit code,
   * and timing. `timeoutSec` bounds server-side execution; clients should set their
   * own HTTP timeout in addition.
   *
   * 502 responses are transient (worker unreachable, worker-side timeout, or worker
   * 5xx — all collapsed into 502 at the scheduler). The SDK's `run()` helper does
   * NOT auto-retry these by default: exec is **not idempotent** — if a 502 hides a
   * successful exec, a retry may run the command twice. Callers opt in with
   * `max_retries=N` per call.
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

export interface ExecResult {
  durationMs: number;

  exitCode: number;

  stderr: string;

  stderrTruncated: boolean;

  stdout: string;

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
   * Lifecycle status. Known values: `provisioning`, `running`, `stopped`,
   * `deleting`, `error`. Terminal failure statuses are `error` and `stopped`; any
   * other non-`running` value indicates the VM is still transitioning. Additional
   * values may be introduced in future server versions; clients should treat unknown
   * values as "in transition" rather than as hard errors.
   */
  status: string;

  deletedAt?: string | null;

  firewall?: Shared.FirewallPolicy;

  machineName?: string;

  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  publicIpv6?: string;

  /**
   * Source snapshot or image name (empty on fresh boot).
   */
  sourceName?: string;
}

export type VmListResponse = Array<Vm>;

export interface VmDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface VmUpdateParams {
  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  name?: string;
}

export interface VmLaunchParams {
  /**
   * Override the default disk size (GiB).
   */
  diskGiB?: number;

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
   * normalization — longer values are truncated server-side). Auto-generated as
   * `vm-<8-char-id-prefix>` if empty.
   */
  name?: string;

  /**
   * Snapshot ID to restore from.
   */
  snapshotId?: string;
}

export interface VmPatchFirewallParams {
  ingress?: Array<Shared.FirewallRule>;

  /**
   * Firewall mode. Known values: `open` (allow all inbound traffic), `restricted`
   * (deny by default; only rules listed in `ingress` are allowed). Additional values
   * may be introduced in future server versions.
   */
  mode?: string;
}

export interface VmRunParams {
  /**
   * Argv-style command. First element must be non-empty. For shell strings, wrap as
   * `["sh", "-c", "<string>"]`.
   */
  command: Array<string>;

  /**
   * Server-side execution timeout in seconds. Must be positive when provided; omit
   * to use the server default.
   */
  timeoutSec?: number;
}

export interface VmSetFirewallParams {
  /**
   * Firewall mode. Known values: `open` (allow all inbound traffic), `restricted`
   * (deny by default; only rules listed in `ingress` are allowed). Additional values
   * may be introduced in future server versions.
   */
  mode: string;

  ingress?: Array<Shared.FirewallRule>;
}

Vms.Files = Files;

export declare namespace Vms {
  export {
    type ConsoleToken as ConsoleToken,
    type ExecResult as ExecResult,
    type Vm as Vm,
    type VmListResponse as VmListResponse,
    type VmDeleteResponse as VmDeleteResponse,
    type VmUpdateParams as VmUpdateParams,
    type VmLaunchParams as VmLaunchParams,
    type VmPatchFirewallParams as VmPatchFirewallParams,
    type VmRunParams as VmRunParams,
    type VmSetFirewallParams as VmSetFirewallParams,
  };

  export {
    Files as Files,
    type PresignResponse as PresignResponse,
    type FileFetchParams as FileFetchParams,
    type FilePresignParams as FilePresignParams,
  };
}
