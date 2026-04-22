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
   * Create a snapshot
   */
  create(body: SnapshotCreateParams, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.post('/v1/snapshots', { body, maxRetries: 0, ...options });
  }

  /**
   * Rename a snapshot
   */
  update(id: string, body: SnapshotUpdateParams, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.patch(path`/v1/snapshots/${id}`, { body, ...options });
  }

  /**
   * List snapshots
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

  firewall?: Shared.FirewallPolicy;

  /**
   * Free-form string→string map. Server-enforced limits: up to 256 keys, key length
   * 1–256 bytes, value length ≤4096 bytes, total JSON encoding ≤65536 bytes.
   */
  metadata?: { [key: string]: string };
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
