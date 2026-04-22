// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface FirewallPolicy {
  /**
   * Firewall mode. Known values: `open` (allow all inbound traffic), `restricted`
   * (deny by default; only rules listed in `ingress` are allowed). Additional values
   * may be introduced in future server versions.
   */
  mode: string;

  ingress?: Array<FirewallRule>;
}

export interface FirewallRule {
  /**
   * Start of port range (inclusive). Required.
   */
  portStart: number;

  /**
   * IP protocol. Known values: `tcp`, `udp`. Additional values may be introduced in
   * future server versions.
   */
  protocol: string;

  description?: string;

  /**
   * End of port range (inclusive). Omit for single-port rules.
   */
  portEnd?: number;

  /**
   * Allowed source CIDRs in IPv6 notation (e.g. `2001:db8::/32`). Omit or empty to
   * allow any source. IPv4 CIDRs are rejected.
   */
  sourceCidrs?: Array<string>;
}
