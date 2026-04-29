// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

/**
 * Pair of signed URLs scoped to the same per-VM staging object. Usable in either
 * direction: either side (client or VM) PUTs bytes to `uploadUrl`, and either side
 * GETs them back via `downloadUrl`. URLs expire after `expiresInSec` seconds and
 * the staging object is auto-deleted after about a day.
 */
export interface FilePresignResponse {
  /**
   * Presigned GET URL for the same staging object. Used by the VM (via
   * `POST /v1/vms/{id}/files/fetch`) on upload, or by the client (via `httpx.stream`
   * / `curl`) on download.
   */
  downloadUrl: string;

  /**
   * Lifetime of both URLs in seconds.
   */
  expiresInSec: number;

  /**
   * Upper bound on upload size (equals the VM's disk size in bytes).
   */
  maxUploadBytes: number;

  /**
   * Presigned PUT URL for the staging object. Accepts
   * `Content-Type: application/octet-stream`. Used by the client on upload, or by
   * the VM (via an exec'd `curl -T -`) on download.
   */
  uploadUrl: string;
}

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
