// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as VmsAPI from './vms';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Firewall extends APIResource {
  /**
   * Partially updates the VM's public IPv6 ingress policy. This does not affect the
   * internal IPv4 path used by platform control and exec.
   */
  patchPolicy(
    id: string,
    body: FirewallPatchPolicyParams,
    options?: RequestOptions,
  ): APIPromise<VmsAPI.VmInstance> {
    return this._client.patch(path`/v1/vms/${id}/firewall`, { body, ...options });
  }

  /**
   * Replaces the VM's public IPv6 ingress policy. This does not affect the internal
   * IPv4 path used by platform control and exec.
   */
  replacePolicy(
    id: string,
    body: FirewallReplacePolicyParams,
    options?: RequestOptions,
  ): APIPromise<VmsAPI.VmInstance> {
    return this._client.put(path`/v1/vms/${id}/firewall`, { body, ...options });
  }
}

/**
 * Public IPv6 ingress firewall policy for a VM or snapshot.
 */
export interface FirewallPolicy {
  mode: 'open' | 'restricted';

  /**
   * Allow rules evaluated only when `mode` is `restricted`. If empty, all public
   * IPv6 ports are closed except essential ICMPv6 control traffic.
   */
  ingress?: Array<FirewallRule>;
}

/**
 * A single allow rule for public IPv6 ingress.
 */
export interface FirewallRule {
  portStart: number;

  protocol: 'tcp' | 'udp';

  description?: string;

  portEnd?: number;

  /**
   * IPv6 CIDRs allowed by this rule. If omitted, the backend treats the rule as open
   * to `::/0`.
   */
  sourceCidrs?: Array<string>;
}

export interface FirewallPatchPolicyParams {
  ingress?: Array<FirewallRule>;

  mode?: 'open' | 'restricted';
}

export interface FirewallReplacePolicyParams {
  mode: 'open' | 'restricted';

  /**
   * Allow rules evaluated only when `mode` is `restricted`. If empty, all public
   * IPv6 ports are closed except essential ICMPv6 control traffic.
   */
  ingress?: Array<FirewallRule>;
}

export declare namespace Firewall {
  export {
    type FirewallPolicy as FirewallPolicy,
    type FirewallRule as FirewallRule,
    type FirewallPatchPolicyParams as FirewallPatchPolicyParams,
    type FirewallReplacePolicyParams as FirewallReplacePolicyParams,
  };
}
