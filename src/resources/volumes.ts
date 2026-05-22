// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Managed shared-volume lifecycle (POSIX-coherent multi-attach via virtio-fs).
 */
export class Volumes extends APIResource {
  /**
   * Create a managed volume
   */
  create(body: VolumeCreateParams, options?: RequestOptions): APIPromise<Volume> {
    return this._client.post('/v1/volumes', { body, maxRetries: 0, ...options });
  }

  /**
   * Get a volume
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<Volume> {
    return this._client.get(path`/v1/volumes/${id}`, options);
  }

  /**
   * Update a volume's name, sizeGiB (grow / shrink-if-not-overfull), or accessMode
   */
  update(id: string, body: VolumeUpdateParams, options?: RequestOptions): APIPromise<Volume> {
    return this._client.patch(path`/v1/volumes/${id}`, { body, ...options });
  }

  /**
   * List volumes
   */
  list(options?: RequestOptions): APIPromise<VolumeListResponse> {
    return this._client.get('/v1/volumes', options);
  }

  /**
   * Returns 200 when the volume transitions to `deleting`. Substrate cleanup is
   * asynchronous; the volume disappears from `GET` after the substrate-cleanup
   * controller completes (typically seconds to minutes for large volumes).
   */
  delete(id: string, options?: RequestOptions): APIPromise<VolumeDeleteResponse> {
    return this._client.delete(path`/v1/volumes/${id}`, options);
  }

  /**
   * List VMs currently attached to this volume
   */
  listAttachments(id: string, options?: RequestOptions): APIPromise<VolumeListAttachmentsResponse> {
    return this._client.get(path`/v1/volumes/${id}/attachments`, options);
  }
}

export interface Volume {
  id: string;

  /**
   * Access mode. Known values: `rw`, `ro`. Future server versions may introduce
   * additional values.
   */
  accessMode: string;

  createdAt: string;

  /**
   * Number of currently-running VMs with this volume attached (paused VMs are NOT
   * counted).
   */
  mountedCount: number;

  name: string;

  orgId: string;

  sizeGiB: number;

  /**
   * Lifecycle status. Known values:
   *
   * - `creating` — the substrate-create saga is in flight. Set by the server briefly
   *   between the customer's `POST /v1/volumes` and the worker substrate
   *   provisioning; attach attempts are rejected with `VOL_NOT_READY` until the saga
   *   commits. Clients polling immediately after create may observe this state.
   * - `ready` — substrate is up; attachable.
   * - `deleting` — cleanup is in progress; not attachable.
   *
   * Future server versions may introduce additional values.
   */
  status: string;

  /**
   * When non-zero, a resize saga is in flight; `sizeGiB` is still the pre-resize
   * value and `pendingSizeGiB` is the target. Set briefly between
   * `PATCH /v1/volumes/{id}` and the substrate resize commit. Clients polling
   * immediately after a resize may observe a non-zero value.
   */
  pendingSizeGiB?: number;

  /**
   * Bytes used inside the volume (rounded down to GiB). Fetched on-demand from the
   * substrate; omitted when the substrate is unreachable.
   */
  usedGiB?: number;
}

export type VolumeListResponse = Array<Volume>;

export interface VolumeDeleteResponse {
  id: string;

  deleted: boolean;
}

export type VolumeListAttachmentsResponse =
  Array<VolumeListAttachmentsResponse.VolumeListAttachmentsResponseItem>;

export namespace VolumeListAttachmentsResponse {
  export interface VolumeListAttachmentsResponseItem extends Shared.VolumeAttachmentItem {
    vmId: string;
  }
}

export interface VolumeCreateParams {
  accessMode: 'rw' | 'ro';

  name: string;

  sizeGiB: number;
}

export interface VolumeUpdateParams {
  accessMode?: 'rw' | 'ro';

  name?: string;

  sizeGiB?: number;
}

export declare namespace Volumes {
  export {
    type Volume as Volume,
    type VolumeListResponse as VolumeListResponse,
    type VolumeDeleteResponse as VolumeDeleteResponse,
    type VolumeListAttachmentsResponse as VolumeListAttachmentsResponse,
    type VolumeCreateParams as VolumeCreateParams,
    type VolumeUpdateParams as VolumeUpdateParams,
  };
}
