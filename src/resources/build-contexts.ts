// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as Shared from './shared';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Build snapshots from a Docker image ref or Dockerfile
 */
export class BuildContexts extends APIResource {
  /**
   * Returns a pair of short-lived signed URLs targeting a per-org staging location.
   * Tar+gzip your build-context directory, PUT it to `uploadUrl` with
   * `Content-Type: application/gzip`, then pass `downloadUrl` as
   * `contextDownloadUrl` on `POST /v1/builds`.
   *
   * Unlike `/v1/vms/{id}/files/presign`, this endpoint isn't keyed to a specific VM
   * — context uploads happen _before_ the build VM exists.
   */
  presign(options?: RequestOptions): APIPromise<Shared.FilePresignResponse> {
    return this._client.post('/v1/build-contexts/presign', { maxRetries: 0, ...options });
  }
}
