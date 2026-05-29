// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

/**
 * Public list price for billable resources (compute + volume storage). Unauthenticated.
 */
export class Pricing extends APIResource {
  /**
   * Published list price for each billable resource type — graduated compute (per
   * vCPU-hour, the rate steps down as monthly usage grows) and volume storage (per
   * GiB-month). Unauthenticated; these are the same numbers shown on the public
   * pricing page.
   */
  retrieve(options?: RequestOptions): APIPromise<PricingResponse> {
    return this._client.get('/v1/pricing', options);
  }
}

/**
 * Public list price for each billable resource type.
 */
export interface PricingResponse {
  /**
   * Graduated vCPU-hour ladder; the rate steps down as monthly cumulative usage
   * crosses a tier boundary.
   */
  compute: PricingResponse.Compute;

  volumeStorage: PricingResponse.VolumeStorage;
}

export namespace PricingResponse {
  /**
   * Graduated vCPU-hour ladder; the rate steps down as monthly cumulative usage
   * crosses a tier boundary.
   */
  export interface Compute {
    tiers: Array<Compute.Tier>;
  }

  export namespace Compute {
    export interface Tier {
      /**
       * Inclusive lower bound, in vCPU-hours.
       */
      fromVcpuHours: number;

      /**
       * USD per vCPU-hour as a decimal string, e.g. "0.09".
       */
      ratePerVcpuHour: string;

      /**
       * 1-indexed tier number.
       */
      tier: number;

      /**
       * Inclusive upper bound; null for the open-ended top tier.
       */
      toVcpuHours: number | null;
    }
  }

  export interface VolumeStorage {
    /**
     * USD per GiB-month as a decimal string, e.g. "0.09".
     */
    ratePerGiBMonth: string;
  }
}

export declare namespace Pricing {
  export { type PricingResponse as PricingResponse };
}
