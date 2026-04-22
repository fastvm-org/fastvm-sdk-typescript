/**
 * Errors raised only by the custom helpers in `fastvm/lib`.
 *
 * All three subclass the generated `FastvmError` root, so `catch
 * (err instanceof FastvmError)` catches every SDK error — helpers
 * included. Regular HTTP errors from the generated client still come
 * through as `APIError` subclasses; those are never re-wrapped.
 *
 * These cover the failure modes the Stainless error hierarchy can't model:
 *
 * - `VMLaunchError`: `GET /v1/vms/{id}` returned 200 OK with `status` in a
 *   terminal failure state (`error` / `stopped` / `deleting`). The HTTP
 *   layer succeeded; the failure is in the response payload.
 * - `VMNotReadyError`: client-side polling deadline exceeded. No HTTP call
 *   timed out, we just stopped polling.
 * - `FileTransferError`: anything that went wrong during `upload()` /
 *   `download()` that isn't a Fastvm HTTP error — GCS PUT/GET failures
 *   (different host, different error schema), local `fs`/`tar` errors,
 *   size-limit violations, and VM-side `tar` / `curl` commands that exited
 *   non-zero.
 */
import { FastvmError } from '../core/error';
import type { ExecResult } from '../resources/vms/vms';

export class VMLaunchError extends FastvmError {
  readonly vmId: string;
  readonly status: string;
  constructor(vmId: string, status: string) {
    super(`VM ${vmId} failed to launch (status=${JSON.stringify(status)})`);
    this.vmId = vmId;
    this.status = status;
    this.name = 'VMLaunchError';
  }
}

export class VMNotReadyError extends FastvmError {
  readonly vmId: string;
  readonly lastStatus: string;
  readonly timeoutMs: number;
  constructor(vmId: string, lastStatus: string, timeoutMs: number) {
    super(
      `VM ${vmId} did not reach status=running within ${Math.round(timeoutMs / 1000)}s ` +
        `(last observed status: ${JSON.stringify(lastStatus)})`,
    );
    this.vmId = vmId;
    this.lastStatus = lastStatus;
    this.timeoutMs = timeoutMs;
    this.name = 'VMNotReadyError';
  }
}

export class FileTransferError extends FastvmError {
  readonly execResult: ExecResult | undefined;
  readonly cause: unknown;
  constructor(message: string, opts?: { cause?: unknown; execResult?: ExecResult }) {
    super(message);
    this.execResult = opts?.execResult;
    this.cause = opts?.cause;
    this.name = 'FileTransferError';
  }
}
