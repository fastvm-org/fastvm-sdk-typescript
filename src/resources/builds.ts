// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Build snapshots from a Docker image ref or Dockerfile
 */
export class Builds extends APIResource {
  /**
   * Submits an asynchronous build. The scheduler creates a build VM, runs
   * `buildah pull` (image-only path) or `buildah bud` (Dockerfile path) inside it,
   * snapshots the result, and tears the VM down.
   *
   * At least one of `imageRef` or `dockerfileContent` must be provided. If
   * `dockerfileContent` is set, the worker writes it verbatim into
   * `/tmp/buildctx/Dockerfile` — buildah handles multi-stage, `SHELL`,
   * `RUN --mount`, etc. natively.
   *
   * For `COPY` instructions that need files, upload the build context first via
   * `POST /v1/build-contexts/presign` and pass the returned download URL as
   * `contextDownloadUrl`.
   *
   * Response is `202 Accepted` with a build ID; poll `GET /v1/builds/{id}` until
   * `status` is `completed` or `failed`.
   */
  create(body: BuildCreateParams, options?: RequestOptions): APIPromise<BuildResponse> {
    return this._client.post('/v1/builds', { body, maxRetries: 0, ...options });
  }

  /**
   * Returns the current state of a build. While the build is in progress, `status`
   * is `pending` or `running` and `progress` contains a human-readable string
   * describing the current phase (e.g. `Pulling image`, `Building (3 steps)`,
   * `Settling VM`).
   *
   * On success, `status` is `completed` and `snapshotId` references a `ready`
   * snapshot — fetch it via `GET /v1/snapshots/{id}`. On failure, `status` is
   * `failed` and `error` carries the worker's diagnostic.
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<BuildResponse> {
    return this._client.get(path`/v1/builds/${id}`, options);
  }
}

/**
 * Build state snapshot. Returned by `POST /v1/builds` (initial `pending` state)
 * and `GET /v1/builds/{id}` (current state on each poll).
 */
export interface BuildResponse {
  /**
   * Build ID (UUID). Use this to poll status.
   */
  id: string;

  createdAt: string;

  imageRef: string;

  /**
   * Current state. Known values: `pending` (accepted, not yet started), `running`
   * (worker is executing), `completed` (snapshot is ready), `failed` (build did not
   * produce a snapshot). Additional values may be introduced in future server
   * versions; clients should treat unknown values as "in progress" rather than as
   * hard errors.
   */
  status: string;

  /**
   * Set when `status` is `failed`. Diagnostic from the worker (truncated to ~4 KiB).
   */
  error?: string;

  name?: string;

  /**
   * Human-readable phase string while the build runs (e.g. `creating build VM`,
   * `buildah pull`, `buildah bud`, `applying image`, `settling VM`,
   * `creating snapshot`). Not present after a terminal status.
   */
  progress?: string;

  /**
   * Set when `status` is `completed`. Fetch the corresponding Snapshot record via
   * `GET /v1/snapshots/{id}`.
   */
  snapshotId?: string;
}

export interface BuildCreateParams {
  /**
   * Presigned GET URL for a `tar.gz` of the build context. The worker downloads and
   * extracts this into `/tmp/buildctx` before invoking buildah, so `COPY`
   * instructions resolve against the user's files. Obtain via
   * `POST /v1/build-contexts/presign`.
   */
  contextDownloadUrl?: string;

  /**
   * Disk size for the build VM. Defaults to 10 GiB if omitted.
   */
  diskGiB?: number;

  /**
   * Raw Dockerfile content to feed to `buildah bud` inside the build VM.
   * Multi-stage, `SHELL`, `RUN --mount`, and every standard Dockerfile feature is
   * supported (handled natively by buildah). Container-runtime metadata (`CMD`,
   * `ENTRYPOINT`, `EXPOSE`, `LABEL`, `HEALTHCHECK`) is consumed by buildah but does
   * not surface on the resulting FastVM snapshot — when the snapshot boots, systemd
   * takes over, not the container's CMD.
   */
  dockerfileContent?: string;

  /**
   * Docker image reference (e.g. `python:3.13-slim`, `ghcr.io/user/repo:tag`). Used
   * directly on the no-Dockerfile path, and as a fallback `FROM` source otherwise.
   */
  imageRef?: string;

  /**
   * Machine size identifier (e.g. `c1m2`, `c2m4`). Controls CPU and memory
   * allocation. Must be supplied on launch unless restoring from a snapshot.
   */
  machineType?: string;

  /**
   * Optional human-readable name for the resulting snapshot. If omitted, the build
   * ID is used.
   */
  name?: string;
}

export declare namespace Builds {
  export { type BuildResponse as BuildResponse, type BuildCreateParams as BuildCreateParams };
}
