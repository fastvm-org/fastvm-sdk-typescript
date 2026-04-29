// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as VmsAPI from './vms';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * File upload/download to/from a running VM
 */
export class Files extends APIResource {
  /**
   * Pulls `url` into the guest at `path`. `url` must be a presigned storage URL
   * previously minted by `POST /v1/vms/{id}/files/presign` (URLs from other sources
   * are rejected).
   *
   * Response mirrors `/v1/vms/{id}/exec`: reports stdout/stderr/exit code of the
   * underlying download+unpack operation.
   *
   * Not idempotent; not retried by default.
   */
  fetch(id: string, body: FileFetchParams, options?: RequestOptions): APIPromise<VmsAPI.ExecResult> {
    return this._client.post(path`/v1/vms/${id}/files/fetch`, { body, maxRetries: 0, ...options });
  }

  /**
   * Returns a pair of short-lived signed URLs targeting a per-VM staging location.
   * Upload to `uploadUrl` with PUT (`Content-Type: application/octet-stream`), then
   * pass `downloadUrl` to `POST /v1/vms/{id}/files/fetch` to have the server pull it
   * into the guest filesystem.
   */
  presign(
    id: string,
    body: FilePresignParams,
    options?: RequestOptions,
  ): APIPromise<Shared.FilePresignResponse> {
    return this._client.post(path`/v1/vms/${id}/files/presign`, { body, maxRetries: 0, ...options });
  }
}

export interface FileFetchParams {
  /**
   * Absolute destination path inside the guest filesystem.
   */
  path: string;

  /**
   * Must be the `downloadUrl` previously returned by
   * `POST /v1/vms/{id}/files/presign` (URLs from other sources are rejected).
   */
  url: string;

  /**
   * Per-fetch timeout in seconds.
   */
  timeoutSec?: number;
}

export interface FilePresignParams {
  /**
   * Absolute destination path inside the guest filesystem (where the file will land
   * after `fetchFileToVm`). Used only to scope the staging object key; any value
   * server-side is accepted here.
   */
  path: string;
}

export declare namespace Files {
  export { type FileFetchParams as FileFetchParams, type FilePresignParams as FilePresignParams };
}
