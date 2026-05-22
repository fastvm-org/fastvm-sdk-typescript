// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Managed shared-volume lifecycle (POSIX-coherent multi-attach via virtio-fs).
 */
export class Volumes extends APIResource {
  /**
   * Attach a volume to a VM
   */
  attach(
    id: string,
    body: VolumeAttachParams,
    options?: RequestOptions,
  ): APIPromise<Shared.VolumeAttachmentItem> {
    return this._client.post(path`/v1/vms/${id}/volumes`, { body, maxRetries: 0, ...options });
  }

  /**
   * Returns 200 with `{detached: true}` on the clean path. May include a `warnings`
   * array on the force-teardown path (eject-ack timeout or guest-unresponsive).
   * Returns 502 with `error: guest_umount_busy` when the guest reports EBUSY; the
   * volume STAYS ATTACHED in this case. Resolve by killing in-VM users of the mount
   * and retrying.
   */
  detach(
    volumeID: string,
    params: VolumeDetachParams,
    options?: RequestOptions,
  ): APIPromise<VolumeDetachResponse> {
    const { id } = params;
    return this._client.delete(path`/v1/vms/${id}/volumes/${volumeID}`, options);
  }
}

export interface VolumeDetachResponse {
  detached: boolean;

  warnings?: Array<VolumeDetachResponse.Warning>;
}

export namespace VolumeDetachResponse {
  export interface Warning {
    message: string;

    /**
     * Known values: `ack_timeout`, `guest_unresponsive`.
     */
    type: string;
  }
}

export interface VolumeAttachParams {
  /**
   * Absolute path; must start with /mnt/ or /data/.
   */
  mountPath: string;

  volumeId: string;

  readOnly?: boolean;
}

export interface VolumeDetachParams {
  /**
   * VM ID (UUID).
   */
  id: string;
}

export declare namespace Volumes {
  export {
    type VolumeDetachResponse as VolumeDetachResponse,
    type VolumeAttachParams as VolumeAttachParams,
    type VolumeDetachParams as VolumeDetachParams,
  };
}
