// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

/**
 * Build snapshots from a Docker / OCI image reference or a client-uploaded Dockerfile + build context
 */
export class SnapshotImports extends APIResource {
  /**
   * Submits an asynchronous import. `source.type` selects the pipeline:
   *
   * - **`image`** — pull `source.image` (any Docker / OCI ref) and export its rootfs
   *   onto the snapshot. Private registries supported via optional
   *   `source.registryUsername` / `source.registryPassword`; the registry host is
   *   derived from the image reference.
   * - **`dockerfile`** — build the user-supplied Dockerfile + its uploaded context.
   *   The context tarball must be uploaded first to the `uploadUrl` returned by
   *   `POST /v1/snapshot-imports/context-presign`; pass the returned `contextRef` as
   *   `source.contextRef`. Private `FROM` pulls supported via
   *   `source.registryUsername` / `source.registryPassword` plus
   *   `source.registryHost` (required when credentials are set on this path).
   *
   * Response is `202 Accepted` with an import id; poll
   * `GET /v1/snapshot-imports/{id}` until `status` is one of `succeeded`, `failed`,
   * or `cancelled`.
   */
  create(body: SnapshotImportCreateParams, options?: RequestOptions): APIPromise<SnapshotImportResponse> {
    return this._client.post('/v1/snapshot-imports', { body, maxRetries: 0, ...options });
  }

  /**
   * Returns the current state of an import including its event log. `status` is one
   * of `pending`, `claimed`, `running`, `succeeded`, `failed`, or `cancelled`. On
   * `succeeded`, `snapshotId` references a `ready` snapshot — fetch it via
   * `GET /v1/snapshots/{id}`. On `failed`, `error` carries a user-safe diagnostic.
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<SnapshotImportResponse> {
    return this._client.get(path`/v1/snapshot-imports/${id}`, options);
  }

  /**
   * Returns every import for the calling org, ordered by `createdAt` descending.
   * Includes pending, in-flight, and terminal rows.
   */
  list(options?: RequestOptions): APIPromise<SnapshotImportListResponse> {
    return this._client.get('/v1/snapshot-imports', options);
  }

  /**
   * Removes the import record and, if the import produced a snapshot, the snapshot
   * itself. Cascading the snapshot delete is safe: snapshots are content-addressed
   * in the underlying block store, and any VMs already booted from the snapshot keep
   * running (the delete only removes the pointer used by future `client.restore()`
   * calls).
   *
   * Refuses non-terminal imports with `409 Conflict`; cancel the import first via
   * `POST /v1/snapshot-imports/{id}/cancel`.
   */
  delete(id: string, options?: RequestOptions): APIPromise<SnapshotImportDeleteResponse> {
    return this._client.delete(path`/v1/snapshot-imports/${id}`, options);
  }

  /**
   * Transitions the import to `cancelled` and best-effort signals the worker to stop
   * the pipeline. Idempotent: re-cancelling a terminal import returns `200` with the
   * current state. Any orphan snapshot produced just before the cancel is
   * best-effort cleaned up.
   */
  cancel(id: string, options?: RequestOptions): APIPromise<SnapshotImportResponse> {
    return this._client.post(path`/v1/snapshot-imports/${id}/cancel`, { maxRetries: 0, ...options });
  }

  /**
   * Returns a short-lived signed PUT URL and a one-shot `contextRef`. Zip your
   * Dockerfile + build context, PUT the archive to `uploadUrl` with
   * `Content-Type: application/zip`, then submit a snapshot import with
   * `source.type=dockerfile` and `source.contextRef=<ref>`. The ref is consumed by
   * the create call and cannot be reused.
   */
  presignContext(
    body: SnapshotImportPresignContextParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<ContextPresignResponse> {
    return this._client.post('/v1/snapshot-imports/context-presign', { body, maxRetries: 0, ...options });
  }
}

/**
 * One-shot upload handle for the dockerfile-source flow.
 */
export interface ContextPresignResponse {
  /**
   * Opaque token to pass as `source.contextRef` on the subsequent
   * `POST /v1/snapshot-imports`. Single-use; the create call consumes the entry.
   */
  contextRef: string;

  /**
   * TTL of `uploadUrl`, in seconds.
   */
  expiresInSec: number;

  /**
   * Server-side cap on upload size. The signed URL also enforces this server-side.
   */
  maxUploadBytes: number;

  /**
   * Short-lived signed PUT URL. Upload the build-context ZIP archive here with
   * `Content-Type: application/zip`.
   */
  uploadUrl: string;
}

/**
 * One entry in an import's append-only event log. Phase + status pairs describe
 * the sub-stages of `running` (preparing → network → pull → export → saving →
 * warming).
 */
export interface SnapshotImportEvent {
  /**
   * Pipeline sub-phase. Known values include `preparing`, `network`, `pull` (image
   * source), `fetch_context`, `build` (dockerfile source), `export`, `saving`,
   * `warming`, `done`.
   */
  phase: string;

  /**
   * Event status. Known values include `started`, `completed`, `failed`, `skipped`,
   * `cancelled`.
   */
  status: string;

  /**
   * Unix-epoch milliseconds.
   */
  timestampMs: number;

  /**
   * Optional user-safe summary. Never contains credentials or internal paths.
   */
  message?: string;
}

/**
 * Current state of a snapshot import. Returned by `POST /v1/snapshot-imports`
 * (initial `pending` state), `GET /v1/snapshot-imports/{id}`,
 * `GET /v1/snapshot-imports` (in the array elements), and
 * `POST /v1/snapshot-imports/{id}/cancel`.
 */
export interface SnapshotImportResponse {
  /**
   * Import id (UUID).
   */
  id: string;

  createdAt: string;

  /**
   * Publicly-rendered source descriptor returned on `GET /v1/snapshot-imports/{id}`.
   * Strips secrets (`registryPassword`, raw context object keys) — only fields safe
   * to echo back to the caller appear here.
   */
  source: SnapshotImportSourceView;

  /**
   * Current state. Known values: `pending` (queued, no worker yet), `claimed`
   * (worker assigned, dispatch in flight), `running` (worker executing the
   * pipeline), `succeeded` / `failed` / `cancelled` (terminal).
   */
  status: string;

  cpu?: number;

  diskGiB?: number;

  /**
   * Set when `status` is `failed`. User-safe diagnostic.
   */
  error?: string;

  events?: Array<SnapshotImportEvent>;

  finishedAt?: string;

  machineName?: string;

  memoryMiB?: number;

  name?: string;

  /**
   * Set when `status` is `succeeded`. Fetch the corresponding Snapshot record via
   * `GET /v1/snapshots/{id}`.
   */
  snapshotId?: string;

  startedAt?: string;

  updatedAt?: string;
}

/**
 * Discriminated source descriptor. `type` selects which other fields are consumed.
 * The opposite-variant fields must be omitted; mixing them is a 400 at the API
 * boundary.
 */
export interface SnapshotImportSourceSpec {
  /**
   * - `image`: pull an existing Docker / OCI image reference.
   * - `dockerfile`: build a user-supplied Dockerfile against an uploaded build
   *   context.
   */
  type: 'image' | 'dockerfile';

  /**
   * Optional `--build-arg KEY=VALUE` pairs forwarded to the build. Capped at 64
   * entries, 8 KiB total.
   */
  buildArgs?: { [key: string]: string };

  /**
   * Opaque one-shot token returned by `POST /v1/snapshot-imports/context-presign`.
   * Required when `type=dockerfile`. The platform validates that the referenced
   * upload belongs to the calling org and consumes the token on use.
   */
  contextRef?: string;

  /**
   * Path to the Dockerfile relative to the context root. Defaults to `Dockerfile`.
   * Must not be absolute and must not contain `..`.
   */
  dockerfilePath?: string;

  /**
   * OCI image reference (e.g. `ghcr.io/foo/bar:v1`, `nginx:1.27`,
   * `alpine@sha256:…`). Required when `type=image`.
   */
  image?: string;

  /**
   * OCI platform selector for multi-arch image indexes, format `<os>/<arch>` (e.g.
   * `linux/amd64`). Defaults to `linux/amd64`. Image-variant only.
   */
  platform?: string;

  /**
   * Registry hostname the `registryUsername` / `registryPassword` authenticate
   * against (e.g. `docker.io`, `ghcr.io`, `1234.dkr.ecr.us-east-1.amazonaws.com`).
   * **Required** when credentials are set on `type=dockerfile`: the baker keys the
   * auth.json entry against this host. Tolerated but ignored for `type=image` (the
   * host is derived from the image reference). Optional port: e.g.
   * `registry.example.com:5000`.
   */
  registryHost?: string;

  /**
   * Optional password / PAT / OAuth token for private registry pulls. Applies to
   * both source kinds. Held in scheduler process memory between create and dispatch
   * (never persisted) and wiped after the build VM is torn down.
   */
  registryPassword?: string;

  /**
   * Optional username for private registry pulls. Applies to both source kinds:
   * `type=image` authenticates the OCI pull, `type=dockerfile` authenticates the
   * `FROM` pulls performed by `buildah` inside the sandbox VM.
   */
  registryUsername?: string;

  /**
   * Optional multi-stage `--target` selector. Empty means the final stage.
   */
  target?: string;
}

/**
 * Publicly-rendered source descriptor returned on `GET /v1/snapshot-imports/{id}`.
 * Strips secrets (`registryPassword`, raw context object keys) — only fields safe
 * to echo back to the caller appear here.
 */
export interface SnapshotImportSourceView {
  type: 'image' | 'dockerfile';

  buildArgs?: { [key: string]: string };

  contextSizeBytes?: number;

  dockerfilePath?: string;

  image?: string;

  platform?: string;

  /**
   * Registry hostname for dockerfile-source private builds. Empty for image-source
   * (derived from the image reference, not stored).
   */
  registryHost?: string;

  registryUsername?: string;

  target?: string;
}

export type SnapshotImportListResponse = Array<SnapshotImportResponse>;

export interface SnapshotImportDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface SnapshotImportCreateParams {
  /**
   * Discriminated source descriptor. `type` selects which other fields are consumed.
   * The opposite-variant fields must be omitted; mixing them is a 400 at the API
   * boundary.
   */
  source: SnapshotImportSourceSpec;

  /**
   * Disk size for the produced snapshot. Defaults to the machine type's catalog
   * default (typically 10 GiB).
   */
  diskGiB?: number;

  /**
   * Machine size identifier (e.g. `c1m2`, `c2m4`). Controls CPU and memory
   * allocation. Must be supplied on launch unless restoring from a snapshot.
   */
  machineType?: string;

  /**
   * Optional human-readable label for the resulting import and snapshot. If omitted,
   * the import id is used.
   */
  name?: string;
}

export interface SnapshotImportPresignContextParams {
  /**
   * Planned upload size. The server rejects this request with `400` when it exceeds
   * the platform-wide cap (the same cap is also enforced by the signed URL itself).
   */
  sizeBytes?: number;
}

export declare namespace SnapshotImports {
  export {
    type ContextPresignResponse as ContextPresignResponse,
    type SnapshotImportEvent as SnapshotImportEvent,
    type SnapshotImportResponse as SnapshotImportResponse,
    type SnapshotImportSourceSpec as SnapshotImportSourceSpec,
    type SnapshotImportSourceView as SnapshotImportSourceView,
    type SnapshotImportListResponse as SnapshotImportListResponse,
    type SnapshotImportDeleteResponse as SnapshotImportDeleteResponse,
    type SnapshotImportCreateParams as SnapshotImportCreateParams,
    type SnapshotImportPresignContextParams as SnapshotImportPresignContextParams,
  };
}
