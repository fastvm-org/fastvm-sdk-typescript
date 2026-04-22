// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Org extends APIResource {
  /**
   * Get organization quota limits and current usage
   */
  retrieveQuotas(options?: RequestOptions): APIPromise<OrgRetrieveQuotasResponse> {
    return this._client.get('/v1/org/quotas', options);
  }
}

export interface OrgQuotaValues {
  diskGiB: number;

  memoryMiB: number;

  snapshotCount: number;

  vcpu: number;
}

export interface OrgRetrieveQuotasResponse {
  limits: OrgQuotaValues;

  orgId: string;

  usage: OrgQuotaValues;
}

export declare namespace Org {
  export {
    type OrgQuotaValues as OrgQuotaValues,
    type OrgRetrieveQuotasResponse as OrgRetrieveQuotasResponse,
  };
}
