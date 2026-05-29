// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Snapshot lifecycle
 */
export class Snapshots extends APIResource {
  /**
   * Captures a VM's state into a customer-visible snapshot. Supported on `running`
   * and `paused` VMs; returns 201 Created with the new snapshot in both cases. On a
   * paused VM, repeated calls within the same pause cycle are idempotent: the second
   * call returns the same snapshot record without modification.
   */
  create(body: SnapshotCreateParams, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.post('/v1/snapshots', { body, maxRetries: 0, ...options });
  }

  /**
   * Returns the full Snapshot record for the given ID, scoped to the authenticated
   * org. Used by the SDK's `build()` flow to fetch the completed snapshot after
   * polling reports `completed`.
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.get(path`/v1/snapshots/${id}`, options);
  }

  /**
   * Rename a snapshot
   */
  update(id: string, body: SnapshotUpdateParams, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.patch(path`/v1/snapshots/${id}`, { body, ...options });
  }

  /**
   * Lists all snapshots for the authenticated org. Supports metadata-equality
   * filtering; callers pass repeated query parameters of the form
   * `metadata.<key>=<value>` (e.g. `metadata.env=prod&metadata.role=api`).
   */
  list(options?: RequestOptions): APIPromise<SnapshotListResponse> {
    return this._client.get('/v1/snapshots', options);
  }

  /**
   * Delete a snapshot
   */
  delete(id: string, options?: RequestOptions): APIPromise<SnapshotDeleteResponse> {
    return this._client.delete(path`/v1/snapshots/${id}`, options);
  }
}

export interface Snapshot {
  id: string;

  createdAt: string;

  name: string;

  orgId: string;

  /**
   * Snapshot lifecycle status. Known values: `creating`, `ready`, `error`.
   * Additional values may be introduced in future server versions.
   */
  status: string;

  vmId: string;

  /**
   * BucketMount metadata captured at snapshot time (no credentials).
   */
  bucketMounts?: Array<Snapshot.BucketMount>;

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
   * Machine type the snapshot was captured on (e.g. `c1m2`). VMs launched from this
   * snapshot inherit it. Omitted for older snapshots captured before this was
   * recorded.
   */
  machineName?: string;

  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };

  /**
   * Captured service registrations from the source VM at snapshot time.
   */
  services?: Array<Snapshot.Service>;

  /**
   * Volume attachments captured at snapshot time.
   */
  volumes?: Array<Snapshot.Volume>;
}

export namespace Snapshot {
  export interface BucketMount {
    bucketUri: string;

    mountPath: string;

    readOnly?: boolean;
  }

  /**
   * Captured (name, port, h2c) tuple for a single service registration on a
   * snapshotted VM. Carried across snapshot/ restore by `POST /v1/vms`
   * (snapshot-restore branch) so the new VM gets the same service registrations the
   * source VM had at snapshot time.
   */
  export interface Service {
    name: string;

    port: number;

    h2c?: boolean;
  }

  export interface Volume {
    mountPath: string;

    volumeId: string;

    readOnly?: boolean;
  }
}

export type SnapshotListResponse = Array<Snapshot>;

export interface SnapshotDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface SnapshotCreateParams {
  vmId: string;

  /**
   * Snapshot name (trimmed + whitespace-collapsed, max 64 runes; longer values are
   * truncated server-side). Auto-generated as `snapshot-<8-char-vmId-prefix>` if
   * empty.
   */
  name?: string;
}

export interface SnapshotUpdateParams {
  name?: string;
}

export declare namespace Snapshots {
  export {
    type Snapshot as Snapshot,
    type SnapshotListResponse as SnapshotListResponse,
    type SnapshotDeleteResponse as SnapshotDeleteResponse,
    type SnapshotCreateParams as SnapshotCreateParams,
    type SnapshotUpdateParams as SnapshotUpdateParams,
  };
}
