/**
 * `FastvmClient` — ergonomic subclass of the generated `Fastvm` client.
 *
 * Adds:
 *   - `client.vms.launch(params, opts?)` — override of the generated `vms.launch`
 *     that polls `GET /v1/vms/{id}` until `status === 'running'` by default
 *     (pass `{ wait: false }` for the raw 201/202 behaviour)
 *   - `waitForVmReady(vmId, opts?)` — standalone poller
 *   - `upload(vmId, localPath, remotePath, opts?)` — unified file/dir upload
 *   - `download(vmId, remotePath, localPath, opts?)` — unified file/dir download
 *
 * Everything else (raw HTTP methods, retries, timeouts, logging, pagination)
 * comes straight from the generated `Fastvm` base class — no wrapping.
 */
import { Fastvm, type ClientOptions } from '../client';
import { Vms, type Vm, type VmLaunchParams } from '../resources/vms/vms';
import type { PresignResponse } from '../resources/vms/files';
import type { RequestOptions } from '../internal/request-options';
import type { APIPromise } from '../core/api-promise';
import { FileTransferError, VMLaunchError, VMNotReadyError } from './errors';

import { spawn, type ChildProcess } from 'node:child_process';
import { createReadStream, createWriteStream, promises as fsp } from 'node:fs';
import * as path from 'node:path';
import { pipeline, Readable } from 'node:stream';
import { promisify } from 'node:util';

const pipelineAsync = promisify(pipeline);

const RUNNING = 'running';
const TERMINAL_FAILURE = new Set(['error', 'stopped', 'deleting']);

const DEFAULT_POLL_INTERVAL_MS = 2000;
const DEFAULT_LAUNCH_TIMEOUT_MS = 300_000;
const DEFAULT_FETCH_TIMEOUT_SEC = 600;
const DEFAULT_EXEC_TIMEOUT_SEC = 600;

const VM_STAGE_DIR = '/var/tmp';

export interface LaunchOptions {
  /** If `false`, skip polling and return the initial (possibly-queued) VM. Default `true`. */
  wait?: boolean;
  /** Polling interval in milliseconds. Default 2000. */
  pollIntervalMs?: number;
  /** Total polling deadline in milliseconds. Default 300000 (5 minutes). */
  timeoutMs?: number;
}

export interface WaitForReadyOptions {
  pollIntervalMs?: number;
  timeoutMs?: number;
}

export interface TransferOptions {
  /** Per-fetch timeout on the VM side (POST /files/fetch). Default 600s. */
  fetchTimeoutSec?: number;
  /** Per-exec timeout on the VM side (tar/curl). Default 600s. */
  execTimeoutSec?: number;
}

/**
 * `Vms` subclass that overrides `launch()` with a polling helper.
 *
 * The generated `Vms.launch(body, options?)` signature is preserved — we only
 * inject `wait` / `pollIntervalMs` / `timeoutMs` via a third argument so the
 * raw-call shape stays byte-compatible with `super.launch`. The override
 * returns `APIPromise<Vm>` so `.asResponse()` / `.withResponse()` still work
 * for callers that want the raw HTTP response; polling short-circuits these
 * helpers and they see the *initial* 201/202 response (not the poll's).
 */
class VmsWithHelpers extends Vms {
  /**
   * `POST /v1/vms` and (by default) poll until the VM reaches `running`.
   *
   * @throws {VMLaunchError} VM reached a terminal failure status.
   * @throws {VMNotReadyError} Polling deadline exceeded before `running`.
   */
  override launch(
    body: VmLaunchParams,
    options?: RequestOptions,
    launchOpts: LaunchOptions = {},
  ): APIPromise<Vm> {
    const raw = super.launch(body, options);
    if (launchOpts.wait === false) return raw;
    const pollOpts: WaitForReadyOptions = {
      pollIntervalMs: launchOpts.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS,
      timeoutMs: launchOpts.timeoutMs ?? DEFAULT_LAUNCH_TIMEOUT_MS,
    };
    // `_thenUnwrap` preserves the raw `APIPromise` (so `.asResponse()` still
    // works) while letting us run async logic on the parsed body.
    return raw._thenUnwrap((vm) =>
      vm.status === RUNNING ? vm : (pollUntilRunning(this, vm.id, pollOpts) as unknown as Vm),
    );
  }
}

export class FastvmClient extends Fastvm {
  override vms: VmsWithHelpers;

  constructor(opts?: ClientOptions) {
    super(opts);
    // Replace the generated `vms` (a plain `Vms` instance constructed in the
    // parent ctor) with our subclass so `client.vms.launch(...)` routes
    // through the polling override.
    this.vms = new VmsWithHelpers(this);
  }

  // -------------------------------- VM lifecycle -------------------------------- //

  /**
   * Poll `GET /v1/vms/{id}` until `status === 'running'` or terminal.
   *
   * Standalone poller — useful when you already have a VM id (e.g. from
   * `client.vms.list()`). For the "launch + wait" flow call
   * `client.vms.launch(...)` directly; it polls by default.
   */
  waitForVmReady(vmId: string, opts: WaitForReadyOptions = {}): Promise<Vm> {
    return pollUntilRunning(this.vms, vmId, opts);
  }

  // -------------------------------- File transfer -------------------------------- //

  /**
   * Copy a local file or directory into a running VM.
   *
   * Dispatches on `fs.stat(localPath)`: directories are streamed as gzipped
   * tar and extracted VM-side; files go through a straight presigned-URL
   * PUT + `/files/fetch`.
   */
  async upload(
    vmId: string,
    localPath: string,
    remotePath: string,
    opts: TransferOptions = {},
  ): Promise<void> {
    const abs = path.resolve(localPath);
    const stat = await fsp.stat(abs).catch((e: unknown) => {
      throw wrapError(`cannot stat ${JSON.stringify(abs)}`, e);
    });
    const fetchTimeoutSec = opts.fetchTimeoutSec ?? DEFAULT_FETCH_TIMEOUT_SEC;
    const execTimeoutSec = opts.execTimeoutSec ?? DEFAULT_EXEC_TIMEOUT_SEC;
    if (stat.isDirectory()) {
      await this.#uploadDirectory(vmId, abs, remotePath, fetchTimeoutSec, execTimeoutSec);
    } else {
      await this.#uploadFile(vmId, abs, remotePath, stat.size, fetchTimeoutSec);
    }
  }

  /**
   * Copy a VM file or directory back to the local filesystem.
   *
   * Dispatches by running `test -d` VM-side first. Missing paths raise
   * `FileTransferError` with the VM's stderr.
   */
  async download(
    vmId: string,
    remotePath: string,
    localPath: string,
    opts: TransferOptions = {},
  ): Promise<void> {
    const fetchTimeoutSec = opts.fetchTimeoutSec ?? DEFAULT_FETCH_TIMEOUT_SEC;
    const execTimeoutSec = opts.execTimeoutSec ?? DEFAULT_EXEC_TIMEOUT_SEC;

    const quoted = shellQuote(remotePath);
    const probe = await this.vms.run(vmId, {
      command: ['sh', '-c', `test -e ${quoted} && (test -d ${quoted} && echo dir || echo file)`],
      timeoutSec: execTimeoutSec,
    });
    if (probe.timedOut || probe.exitCode !== 0) {
      const err = new Error(`remote path not found: ${remotePath}`) as NodeJS.ErrnoException;
      err.code = 'ENOENT';
      throw err;
    }
    const kind = probe.stdout.trim();
    if (kind === 'dir') {
      await this.#downloadDirectory(vmId, remotePath, localPath, fetchTimeoutSec, execTimeoutSec);
    } else {
      await this.#downloadFile(vmId, remotePath, localPath, fetchTimeoutSec, execTimeoutSec);
    }
  }

  // -------------------------------- Internals: upload -------------------------------- //

  async #uploadFile(
    vmId: string,
    local: string,
    remote: string,
    size: number,
    fetchTimeoutSec: number,
  ): Promise<void> {
    const presign = await this.vms.files.presign(vmId, { path: remote });
    assertUnderLimit(size, presign);
    await httpPutStream(presign.uploadUrl, createReadStream(local), size);
    const result = await this.vms.files.fetch(vmId, {
      url: presign.downloadUrl,
      path: remote,
      timeoutSec: fetchTimeoutSec,
    });
    requireExecOk(`fetch ${remote}`, result);
  }

  async #uploadDirectory(
    vmId: string,
    localDir: string,
    remoteDir: string,
    fetchTimeoutSec: number,
    execTimeoutSec: number,
  ): Promise<void> {
    const stageTar = stageTarPath('upload');
    const presign = await this.vms.files.presign(vmId, { path: stageTar });

    // Stream tar -czf . -C localDir → PUT to GCS. Size is unknown up front;
    // GCS accepts chunked uploads for signed PUT URLs.
    const tarProc = spawnTar(['-cz', '-C', localDir, '.']);
    const tarOut = tarProc.stdout;
    if (!tarOut) throw new FileTransferError('tar process produced no stdout');
    try {
      await httpPutStream(presign.uploadUrl, tarOut);
    } finally {
      await closeTarOrThrow(tarProc, 'tar pack');
    }

    const quotedRemote = shellQuote(remoteDir);
    const quotedStage = shellQuote(stageTar);
    const fetchRes = await this.vms.files.fetch(vmId, {
      url: presign.downloadUrl,
      path: stageTar,
      timeoutSec: fetchTimeoutSec,
    });
    requireExecOk(`fetch ${stageTar}`, fetchRes);

    const extract = await this.vms.run(vmId, {
      command: [
        'sh',
        '-c',
        `mkdir -p ${quotedRemote} && tar -xzf ${quotedStage} -C ${quotedRemote} && rm -f ${quotedStage}`,
      ],
      timeoutSec: execTimeoutSec,
    });
    requireExecOk(`tar extract ${remoteDir}`, extract);
  }

  // -------------------------------- Internals: download -------------------------------- //

  async #downloadFile(
    vmId: string,
    remote: string,
    local: string,
    fetchTimeoutSec: number,
    execTimeoutSec: number,
  ): Promise<void> {
    const presign = await this.vms.files.presign(vmId, { path: remote });
    const quotedRemote = shellQuote(remote);
    const quotedUrl = shellQuote(presign.uploadUrl);
    const push = await this.vms.run(vmId, {
      command: [
        'sh',
        '-c',
        `curl --fail --show-error -s -X PUT -H 'Content-Type: application/octet-stream' -T ${quotedRemote} ${quotedUrl}`,
      ],
      timeoutSec: execTimeoutSec,
    });
    requireExecOk(`curl push ${remote}`, push);

    await fsp.mkdir(path.dirname(path.resolve(local)), { recursive: true });
    await httpGetToFile(presign.downloadUrl, local, fetchTimeoutSec);
  }

  async #downloadDirectory(
    vmId: string,
    remoteDir: string,
    localDir: string,
    fetchTimeoutSec: number,
    execTimeoutSec: number,
  ): Promise<void> {
    const presign = await this.vms.files.presign(vmId, { path: remoteDir });
    const quotedRemote = shellQuote(remoteDir);
    const quotedUrl = shellQuote(presign.uploadUrl);
    const push = await this.vms.run(vmId, {
      command: [
        'sh',
        '-c',
        `tar -cz -C ${quotedRemote} . | curl --fail --show-error -s -X PUT -H 'Content-Type: application/octet-stream' -T - ${quotedUrl}`,
      ],
      timeoutSec: execTimeoutSec,
    });
    requireExecOk(`tar push ${remoteDir}`, push);

    await fsp.mkdir(path.resolve(localDir), { recursive: true });
    await httpGetToTarExtract(presign.downloadUrl, localDir, fetchTimeoutSec);
  }
}

// ----------------------------- helpers (non-exported) ----------------------------- //

async function pollUntilRunning(vms: Vms, vmId: string, opts: WaitForReadyOptions): Promise<Vm> {
  const pollIntervalMs = opts.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const timeoutMs = opts.timeoutMs ?? DEFAULT_LAUNCH_TIMEOUT_MS;
  const deadline = Date.now() + timeoutMs;
  let lastStatus = 'unknown';
  while (true) {
    const vm = await vms.retrieve(vmId);
    lastStatus = vm.status;
    if (vm.status === RUNNING) return vm;
    if (TERMINAL_FAILURE.has(vm.status)) throw new VMLaunchError(vmId, vm.status);
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new VMNotReadyError(vmId, lastStatus, timeoutMs);
    await sleep(Math.min(jitter(pollIntervalMs), remaining));
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(intervalMs: number): number {
  const j = intervalMs * 0.1;
  return Math.max(500, intervalMs + (Math.random() * 2 - 1) * j);
}

function stageTarPath(tag: string): string {
  const rnd = Math.floor(Math.random() * 0x1_0000_0000).toString(16);
  return `${VM_STAGE_DIR}/fastvm-${tag}-${process.pid}-${rnd}.tar.gz`;
}

function shellQuote(s: string): string {
  return `'${s.replace(/'/g, `'\\''`)}'`;
}

function assertUnderLimit(size: number, presign: PresignResponse): void {
  if (size > presign.maxUploadBytes) {
    throw new FileTransferError(`upload size ${size} exceeds VM limit ${presign.maxUploadBytes}`);
  }
}

function requireExecOk(preview: string, result: import('../resources/vms/vms').ExecResult): void {
  if (result.timedOut || result.exitCode !== 0) {
    const reason = result.timedOut ? 'timed out' : `exitCode=${result.exitCode}`;
    const stderr = (result.stderr || '').slice(0, 2000);
    throw new FileTransferError(`VM command failed (${reason}): ${preview}\nstderr: ${stderr}`, {
      execResult: result,
    });
  }
}

function wrapError(msg: string, cause: unknown): FileTransferError {
  return new FileTransferError(`${msg}: ${(cause as Error)?.message ?? String(cause)}`, { cause });
}

function spawnTar(args: string[]): ChildProcess {
  const proc = spawn('tar', args);
  proc.on('error', (e) => {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error('fastvm: system `tar` not found on PATH — required for directory upload/download.');
    }
  });
  return proc;
}

async function closeTarOrThrow(proc: ChildProcess, label: string): Promise<void> {
  const [code, stderr] = await new Promise<[number | null, string]>((resolve) => {
    let err = '';
    proc.stderr?.on('data', (c: Buffer) => {
      err += c.toString('utf8');
    });
    proc.on('close', (c) => resolve([c, err]));
  });
  if (code !== 0) {
    throw new FileTransferError(`${label} exited with code ${code}: ${stderr.slice(0, 2000)}`);
  }
}

async function httpPutStream(url: string, body: NodeJS.ReadableStream, size?: number): Promise<void> {
  const headers: Record<string, string> = { 'Content-Type': 'application/octet-stream' };
  if (size !== undefined) headers['Content-Length'] = String(size);
  const webBody = Readable.toWeb(Readable.from(body)) as ReadableStream<Uint8Array>;
  // Node 18+ requires `duplex: 'half'` for streaming request bodies; not yet in all @types/node versions.
  const init = { method: 'PUT', headers, body: webBody, duplex: 'half' } as RequestInit;
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new FileTransferError(`storage PUT failed (${res.status}): ${text.slice(0, 2000)}`);
  }
}

async function httpGetToFile(url: string, localPath: string, timeoutSec: number): Promise<void> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutSec * 1000);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok || !res.body) {
      throw new FileTransferError(`storage GET failed (${res.status})`);
    }
    await pipelineAsync(Readable.fromWeb(res.body as never), createWriteStream(localPath));
  } catch (e) {
    throw wrapError(`storage GET → ${localPath} failed`, e);
  } finally {
    clearTimeout(t);
  }
}

async function httpGetToTarExtract(url: string, localDir: string, timeoutSec: number): Promise<void> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutSec * 1000);
  try {
    const res = await fetch(url, { signal: ac.signal });
    if (!res.ok || !res.body) {
      throw new FileTransferError(`storage GET failed (${res.status})`);
    }
    const extract = spawnTar(['-xz', '-C', localDir]);
    const extractIn = extract.stdin;
    if (!extractIn) throw new FileTransferError('tar extract process has no stdin');
    const webBody = res.body as ReadableStream<Uint8Array>;
    await pipelineAsync(Readable.fromWeb(webBody as never), extractIn);
    await closeTarOrThrow(extract, 'tar extract');
  } catch (e) {
    throw wrapError(`storage GET → tar extract ${localDir} failed`, e);
  } finally {
    clearTimeout(t);
  }
}
