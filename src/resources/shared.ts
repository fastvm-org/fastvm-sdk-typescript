// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export interface BucketMount {
  id: string;

  /**
   * `gs://...` or `s3://...`; future schemes may be added.
   */
  bucketUri: string;

  createdAt: string;

  mountPath: string;

  /**
   * Known values: `mounted`, `failed`, `pending`.
   */
  mountStatus: string;

  vmId: string;

  readOnly?: boolean;

  statusMessage?: string;
}

/**
 * Toggles the meaning of `dns.domains`.
 *
 * - `allow`: allowlist — only listed domains can resolve; any other query returns
 *   NXDOMAIN.
 * - `deny`: blocklist — listed domains return NXDOMAIN; all other queries resolve
 *   through the upstream resolver.
 *
 * Default is `deny` with an empty list, which means "resolve everything" — the
 * safe default that preserves existing behavior when callers omit the `dns` block.
 */
export type DNSMode = 'allow' | 'deny';

/**
 * DNS-layer filtering, independent of egress L4 rules. The resolver applies the
 * DNS gate BEFORE L4 enforcement; a domain blocked here returns NXDOMAIN
 * regardless of what egress.rules says about its IPs. All fields are optional —
 * the server defaults `mode` to `deny` when missing, `domains` to `[]`, and
 * `blockBypass` to false (see `normalizeDNSPolicy` in
 * `scheduler/internal/httpapi/firewall.go`).
 */
export interface DNSPolicy {
  /**
   * When true, the worker denies DoT (TCP 853) and the known public DoH endpoint IPs
   * at the nft layer so guests cannot sidestep the in-process resolver. Default
   * `false` — turning this on breaks workloads that legitimately reach `1.1.1.1` /
   * `8.8.8.8` / etc. on TCP/443 for non-DoH reasons (e.g. services whose data plane
   * lives on a Cloudflare anycast IP). Operators who enable DNS allowlist mode
   * typically also flip this on explicitly.
   */
  blockBypass?: boolean;

  domains?: Array<string>;

  /**
   * Toggles the meaning of `dns.domains`.
   *
   * - `allow`: allowlist — only listed domains can resolve; any other query returns
   *   NXDOMAIN.
   * - `deny`: blocklist — listed domains return NXDOMAIN; all other queries resolve
   *   through the upstream resolver.
   *
   * Default is `deny` with an empty list, which means "resolve everything" — the
   * safe default that preserves existing behavior when callers omit the `dns` block.
   */
  mode?: DNSMode;
}

export interface EgressPolicy {
  /**
   * Allow/deny verb. Used both as the per-direction default posture and as each
   * rule's action.
   */
  default: PolicyAction;

  rules?: Array<EgressRule>;
}

export interface EgressRule {
  /**
   * Allow/deny verb. Used both as the per-direction default posture and as each
   * rule's action.
   */
  action: PolicyAction;

  /**
   * Egress rule kind.
   *
   * - `cidr`: match by destination IP/CIDR + port/proto.
   * - `fqdn`: match by destination domain (resolved through the in-process DNS
   *   resolver) + port/proto. Resolved IPs land in a per-rule dynamic nft set; the
   *   chain emits one rule per fqdn rule keyed on (set, proto, port). Port/proto
   *   enforcement on fqdn rules is honest — the prior `kind: domain` shape with a
   *   shared allow-set silently ignored them.
   *
   * Fqdn values accept an optional leading `*.` wildcard (e.g. `*.example.com`).
   * Bare wildcards and non-leading wildcards are rejected. Wildcards match
   * one-or-more labels left of the suffix and do not match the apex (matches DNS
   * wildcard semantics).
   */
  kind: EgressRuleKind;

  /**
   * Single port (`443`), inclusive range (`8080-8090`), or `any`. When `protocol` is
   * `any`, `ports` MUST be `any`.
   */
  ports: string;

  protocol: 'tcp' | 'udp' | 'any';

  /**
   * For `kind: cidr`, an IPv4 or IPv6 CIDR. For `kind: fqdn`, a domain name with
   * optional leading `*.` wildcard. Must be reachable through the `dns` gate — a
   * fqdn value blocked by `dns.mode`/`dns.domains` is rejected at PUT time as a dead
   * rule.
   */
  value: string;

  description?: string;
}

/**
 * Egress rule kind.
 *
 * - `cidr`: match by destination IP/CIDR + port/proto.
 * - `fqdn`: match by destination domain (resolved through the in-process DNS
 *   resolver) + port/proto. Resolved IPs land in a per-rule dynamic nft set; the
 *   chain emits one rule per fqdn rule keyed on (set, proto, port). Port/proto
 *   enforcement on fqdn rules is honest — the prior `kind: domain` shape with a
 *   shared allow-set silently ignored them.
 *
 * Fqdn values accept an optional leading `*.` wildcard (e.g. `*.example.com`).
 * Bare wildcards and non-leading wildcards are rejected. Wildcards match
 * one-or-more labels left of the suffix and do not match the apex (matches DNS
 * wildcard semantics).
 */
export type EgressRuleKind = 'cidr' | 'fqdn';

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

/**
 * Top-level firewall policy with three independent axes. All sub-blocks are
 * optional — the server substitutes the safe default (ingress deny / egress allow
 * / dns mode=deny + empty) for missing blocks. Sending `firewall: null` on VM
 * create is also valid.
 */
export interface FirewallPolicy {
  /**
   * DNS-layer filtering, independent of egress L4 rules. The resolver applies the
   * DNS gate BEFORE L4 enforcement; a domain blocked here returns NXDOMAIN
   * regardless of what egress.rules says about its IPs. All fields are optional —
   * the server defaults `mode` to `deny` when missing, `domains` to `[]`, and
   * `blockBypass` to false (see `normalizeDNSPolicy` in
   * `scheduler/internal/httpapi/firewall.go`).
   */
  dns?: DNSPolicy;

  egress?: EgressPolicy;

  ingress?: IngressPolicy;
}

export interface IngressPolicy {
  /**
   * Allow/deny verb. Used both as the per-direction default posture and as each
   * rule's action.
   */
  default: PolicyAction;

  rules?: Array<IngressRule>;
}

export interface IngressRule {
  /**
   * Allow/deny verb. Used both as the per-direction default posture and as each
   * rule's action.
   */
  action: PolicyAction;

  /**
   * Ingress rule kind. Only `cidr` is supported — inbound packets don't carry a
   * domain the worker could match on without TLS interception.
   */
  kind: IngressRuleKind;

  /**
   * Single port (`443`), inclusive range (`8080-8090`), or `any`. When `protocol` is
   * `any`, `ports` MUST be `any`.
   */
  ports: string;

  protocol: 'tcp' | 'udp' | 'any';

  /**
   * CIDR (e.g. `::/0`, `10.0.0.0/8`). IPv4 and IPv6 CIDRs are both accepted in the
   * schema; L3 enforcement coverage per family is a worker-side concern.
   */
  value: string;

  description?: string;
}

/**
 * Ingress rule kind. Only `cidr` is supported — inbound packets don't carry a
 * domain the worker could match on without TLS interception.
 */
export type IngressRuleKind = 'cidr';

/**
 * Allow/deny verb. Used both as the per-direction default posture and as each
 * rule's action.
 */
export type PolicyAction = 'allow' | 'deny';

export interface VolumeAttachmentItem {
  mountPath: string;

  /**
   * Known values: `mounted`, `failed`, `pending`. `pending` appears on attachments
   * to paused VMs (mount happens on resume) and briefly during in-flight hot-attach.
   */
  mountStatus: string;

  volumeId: string;

  readOnly?: boolean;

  statusMessage?: string;
}
