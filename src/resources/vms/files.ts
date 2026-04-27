// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as VmsAPI from './vms';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * File upload/download to/from a running VM
 */
export class Files extends APIResource {
  /**
   * Scheduler asks the VM worker to download `url` into the guest at `path`. `url`
   * must be a presigned storage URL previously minted by
   * `POST /v1/vms/{id}/files/presign` (URLs from other sources are rejected).
   *
   * Response mirrors `/v1/vms/{id}/exec`: the worker runs the fetch via the guest
   * agent and reports stdout/stderr/exit code of the underlying download+unpack
   * operation.
   *
   * Not idempotent; not retried by default.
   */
  fetch(id: string, body: FileFetchParams, options?: RequestOptions): APIPromise<VmsAPI.ExecResult> {
    return this._client.post(path`/v1/vms/${id}/files/fetch`, { body, maxRetries: 0, ...options });
  }

  /**
   * Returns a pair of short-lived signed URLs targeting a per-VM staging location.
   * Upload to `uploadUrl` with PUT (`Content-Type: application/octet-stream`), then
   * pass `downloadUrl` to `POST /v1/vms/{id}/files/fetch` to have the worker pull it
   * into the guest filesystem.
   */
  presign(id: string, body: FilePresignParams, options?: RequestOptions): APIPromise<PresignResponse> {
    return this._client.post(path`/v1/vms/${id}/files/presign`, { body, maxRetries: 0, ...options });
  }
}

/**
 * Pair of signed URLs scoped to the same per-VM staging object. Usable in either
 * direction: either side (client or VM) PUTs bytes to `uploadUrl`, and either side
 * GETs them back via `downloadUrl`. URLs expire after `expiresInSec` seconds and
 * the staging object is auto-deleted after about a day.
 */
export interface PresignResponse {
  /**
   * Presigned GET URL for the same staging object. Used by the VM (via
   * `POST /v1/vms/{id}/files/fetch`) on upload, or by the client (via `httpx.stream`
   * / `curl`) on download.
   */
  downloadUrl: string;

  /**
   * Lifetime of both URLs in seconds.
   */
  expiresInSec: number;

  /**
   * Upper bound on upload size (equals the VM's disk size in bytes).
   */
  maxUploadBytes: number;

  /**
   * Presigned PUT URL for the staging object. Accepts
   * `Content-Type: application/octet-stream`. Used by the client on upload, or by
   * the VM (via an exec'd `curl -T -`) on download.
   */
  uploadUrl: string;
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
  export {
    type PresignResponse as PresignResponse,
    type FileFetchParams as FileFetchParams,
    type FilePresignParams as FilePresignParams,
  };
}
