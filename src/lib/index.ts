/**
 * Hand-written ergonomic helpers on top of the generated `Fastvm` client.
 * See `helpers.md` for prose docs and `CUSTOM_CODE.md` (in `fastvm-mono`)
 * for the why.
 */
export { FastvmClient } from './client';
export type { LaunchOptions, WaitForReadyOptions, TransferOptions } from './client';
export { FileTransferError, VMLaunchError, VMNotReadyError } from './errors';
