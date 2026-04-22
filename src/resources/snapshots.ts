// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as FirewallAPI from './vms/firewall';
import * as VmsAPI from './vms/vms';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Snapshots extends APIResource {
  /**
   * Create a snapshot from a VM id
   */
  create(body: SnapshotCreateParams, options?: RequestOptions): APIPromise<SnapshotObject> {
    return this._client.post('/v1/snapshots', { body, ...options });
  }

  /**
   * Rename a snapshot
   */
  update(id: string, body: SnapshotUpdateParams, options?: RequestOptions): APIPromise<SnapshotObject> {
    return this._client.patch(path`/v1/snapshots/${id}`, { body, ...options });
  }

  /**
   * List snapshots for the authenticated organization
   */
  list(options?: RequestOptions): APIPromise<SnapshotListResponse> {
    return this._client.get('/v1/snapshots', options);
  }

  /**
   * Delete a snapshot
   */
  delete(id: string, options?: RequestOptions): APIPromise<VmsAPI.DeleteResponse> {
    return this._client.delete(path`/v1/snapshots/${id}`, options);
  }
}

export interface SnapshotObject {
  id: string;

  createdAt: string;

  name: string;

  orgId: string;

  status: 'creating' | 'ready' | 'error';

  vmId: string;

  /**
   * Public IPv6 ingress firewall policy applied to the VM.
   */
  firewall?: FirewallAPI.FirewallPolicy;
}

export type SnapshotListResponse = Array<SnapshotObject>;

export interface SnapshotCreateParams {
  vmId: string;

  name?: string;
}

export interface SnapshotUpdateParams {
  name: string;
}

export declare namespace Snapshots {
  export {
    type SnapshotObject as SnapshotObject,
    type SnapshotListResponse as SnapshotListResponse,
    type SnapshotCreateParams as SnapshotCreateParams,
    type SnapshotUpdateParams as SnapshotUpdateParams,
  };
}
