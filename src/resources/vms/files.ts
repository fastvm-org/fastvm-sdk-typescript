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
   * Response mirrors `/v1/vms/{id}/exec` — the worker runs the fetch via the guest
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
 * Pair of signed URLs scoped to the same per-VM staging object. Both are usable in
 * either direction — the pair supports both uploading a file into a VM and
 * downloading a file out of a VM, depending on how the SDK wires them up:
 *
 * - **Upload (client → VM)**: client PUTs bytes to `uploadUrl`, then calls
 *   `POST /v1/vms/{id}/files/fetch` with `url: downloadUrl` to have the VM pull
 *   the object into the guest filesystem.
 * - **Download (VM → client)**: SDK issues an exec command inside the VM that
 *   pipes file contents to `uploadUrl`
 *   (`tar czf - <path> | curl -T - <uploadUrl>`), then GETs `downloadUrl` from the
 *   client to stream the bytes back.
 *
 * The staging object is auto-deleted ~1 day after creation; the URLs themselves
 * expire after `expiresInSec` seconds.
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
