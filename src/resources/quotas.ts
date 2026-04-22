// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Org quotas and usage
 */
export class Quotas extends APIResource {
  /**
   * Get org quotas and usage
   */
  retrieve(options?: RequestOptions): APIPromise<OrgQuotaUsage> {
    return this._client.get('/v1/org/quotas', options);
  }
}

export interface OrgQuotaUsage {
  limits: OrgQuotaValues;

  orgId: string;

  usage: OrgQuotaValues;
}

export interface OrgQuotaValues {
  diskGiB: number;

  memoryMiB: number;

  snapshotCount: number;

  vcpu: number;
}

export declare namespace Quotas {
  export { type OrgQuotaUsage as OrgQuotaUsage, type OrgQuotaValues as OrgQuotaValues };
}
