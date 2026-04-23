/**
 * Hand-written ergonomic helpers on top of the generated `Fastvm` client.
 * See https://fastvm.org/docs/typescript for the full reference (signatures,
 * examples, design notes). Structured specs live in `fastvm-mono/api/helpers.yaml`.
 */
export { FastvmClient } from './client';
export type { LaunchOptions, WaitForReadyOptions, TransferOptions } from './client';
export { FileTransferError, VMLaunchError, VMNotReadyError } from './errors';
