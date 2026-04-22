// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ConsoleAPI from './console';
import { Console, ConsoleWebsocketParams } from './console';
import * as FirewallAPI from './firewall';
import {
  Firewall,
  FirewallPatchPolicyParams,
  FirewallPolicy,
  FirewallReplacePolicyParams,
  FirewallRule,
} from './firewall';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Vms extends APIResource {
  firewall: FirewallAPI.Firewall = new FirewallAPI.Firewall(this._client);
  console: ConsoleAPI.Console = new ConsoleAPI.Console(this._client);

  /**
   * Create VM from a base image or snapshot
   */
  create(body: VmCreateParams, options?: RequestOptions): APIPromise<VmInstance> {
    return this._client.post('/v1/vms', { body, ...options });
  }

  /**
   * Get a single VM by id
   */
  retrieve(id: string, options?: RequestOptions): APIPromise<VmInstance> {
    return this._client.get(path`/v1/vms/${id}`, options);
  }

  /**
   * List VMs for the authenticated organization
   */
  list(options?: RequestOptions): APIPromise<VmListResponse> {
    return this._client.get('/v1/vms', options);
  }

  /**
   * Delete a VM
   */
  delete(id: string, options?: RequestOptions): APIPromise<DeleteResponse> {
    return this._client.delete(path`/v1/vms/${id}`, options);
  }

  /**
   * Execute a one-off command inside a running VM
   */
  executeCommand(
    id: string,
    body: VmExecuteCommandParams,
    options?: RequestOptions,
  ): APIPromise<VmExecuteCommandResponse> {
    return this._client.post(path`/v1/vms/${id}/exec`, { body, ...options });
  }

  /**
   * Issue one-time token for websocket console access
   */
  issueConsoleToken(id: string, options?: RequestOptions): APIPromise<VmIssueConsoleTokenResponse> {
    return this._client.post(path`/v1/vms/${id}/console-token`, options);
  }

  /**
   * Rename a VM
   */
  rename(id: string, body: VmRenameParams, options?: RequestOptions): APIPromise<VmInstance> {
    return this._client.patch(path`/v1/vms/${id}`, { body, ...options });
  }
}

export interface DeleteResponse {
  id: string;

  deleted: boolean;
}

export interface VmInstance {
  id: string;

  cpu: number;

  createdAt: string;

  diskGiB: number;

  machineName: string;

  memoryMiB: number;

  name: string;

  orgId: string;

  status: 'provisioning' | 'running' | 'stopped' | 'deleting' | 'error';

  deletedAt?: string | null;

  /**
   * Public IPv6 ingress firewall policy. If omitted for a newly created VM, the
   * default is `restricted` with no ingress rules.
   */
  firewall?: FirewallAPI.FirewallPolicy;

  publicIpv6?: string;

  sourceName?: string;
}

export type VmListResponse = Array<VmInstance>;

export interface VmExecuteCommandResponse {
  durationMs: number;

  exitCode: number;

  stderr: string;

  stderrTruncated: boolean;

  stdout: string;

  stdoutTruncated: boolean;

  timedOut: boolean;
}

export interface VmIssueConsoleTokenResponse {
  token: string;

  expiresInSec: number;

  websocketPath: string;
}

export interface VmCreateParams {
  /**
   * Optional grow-only disk size in GiB. Must be >= base machine disk (10 GiB) or >=
   * source snapshot VM disk.
   */
  diskGiB?: number;

  /**
   * Public IPv6 ingress firewall policy captured from the source VM at snapshot
   * time.
   */
  firewall?: FirewallAPI.FirewallPolicy;

  machineType?: 'c1m2' | 'c2m4' | 'c4m8' | 'c8m16';

  name?: string;

  snapshotId?: string;
}

export interface VmExecuteCommandParams {
  command: Array<string>;

  timeoutSec?: number;
}

export interface VmRenameParams {
  name: string;
}

Vms.Firewall = Firewall;
Vms.Console = Console;

export declare namespace Vms {
  export {
    type DeleteResponse as DeleteResponse,
    type VmInstance as VmInstance,
    type VmListResponse as VmListResponse,
    type VmExecuteCommandResponse as VmExecuteCommandResponse,
    type VmIssueConsoleTokenResponse as VmIssueConsoleTokenResponse,
    type VmCreateParams as VmCreateParams,
    type VmExecuteCommandParams as VmExecuteCommandParams,
    type VmRenameParams as VmRenameParams,
  };

  export {
    Firewall as Firewall,
    type FirewallPolicy as FirewallPolicy,
    type FirewallRule as FirewallRule,
    type FirewallPatchPolicyParams as FirewallPatchPolicyParams,
    type FirewallReplacePolicyParams as FirewallReplacePolicyParams,
  };

  export { Console as Console, type ConsoleWebsocketParams as ConsoleWebsocketParams };
}
