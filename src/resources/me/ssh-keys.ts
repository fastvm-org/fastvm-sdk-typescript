// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Per-user authorized SSH key management. Register one pubkey on
 * your user, then `ssh <vmId>@<org-slug>.ssh.<stack-domain>` works
 * for every VM in every org you're a member of. The per-stack SSH
 * gateway uses CA-signed user certificates internally — VMs trust
 * the CA, not your raw pubkey, so the customer-facing pubkey lives
 * only at the gateway.
 */
export class SSHKeys extends APIResource {
  /**
   * Returns every SSH public key registered to the calling user. Keys are personal:
   * registering a key once authorizes `ssh <vmId>@ssh.<domain>` for any VM in any
   * org you are a member of. SSH terminates at the per-stack gateway and is
   * forwarded to the VM over the cluster network; the VM does not need to be
   * publicly IPv4-reachable, and you do not need to know the VM's IPv6 address.
   */
  list(options?: RequestOptions): APIPromise<SSHKeyListResponse> {
    return this._client.get('/v1/me/ssh-keys', options);
  }

  /**
   * Deletes one of the calling user's keys by fingerprint. Existing SSH sessions are
   * NOT terminated — the key simply won't authorize new connections after removal.
   */
  delete(fingerprint: string, options?: RequestOptions): APIPromise<SSHKeyDeleteResponse> {
    return this._client.delete(path`/v1/me/ssh-keys/${fingerprint}`, options);
  }

  /**
   * Adds one authorized SSH public key to the calling user. The fingerprint is
   * derived server-side and returned. Duplicate fingerprints return 409. Up to 32
   * keys per user. After this call, `ssh <vmId>@ssh.<domain>` works for any VM you
   * have access to.
   *
   * Each fingerprint is globally unique: registering a public key that another user
   * already has on file returns 409.
   */
  add(body: SSHKeyAddParams, options?: RequestOptions): APIPromise<SSHKey> {
    return this._client.post('/v1/me/ssh-keys', { body, maxRetries: 0, ...options });
  }
}

export interface SSHKey {
  createdAt: string;

  /**
   * OpenSSH SHA256 fingerprint, e.g. `SHA256:abc...`. This is the **identifier** —
   * matches what `ssh-keygen -lf` prints and what your ssh client shows on first
   * connect; pass it back as the `{fingerprint}` path segment to `deleteSshKey`.
   */
  fingerprint: string;

  /**
   * OpenSSH-format public key, of the form `<type> <base64-blob>` — the optional
   * comment is stripped server-side. Supported types: `ssh-ed25519`, `ssh-rsa`,
   * `ecdsa-sha2-nistp{256,384,521}`, plus FIDO2 hardware-backed variants
   * (`sk-...@openssh.com`).
   */
  publicKey: string;

  /**
   * Optional human label.
   */
  name?: string;
}

export interface SSHKeyListResponse {
  keys: Array<SSHKey>;
}

export interface SSHKeyDeleteResponse {
  id: string;

  deleted: boolean;
}

export interface SSHKeyAddParams {
  /**
   * OpenSSH-format public key (`ssh-ed25519 AAA...`). Comments are stripped.
   * Newlines are rejected.
   */
  publicKey: string;

  /**
   * Optional human label.
   */
  name?: string;
}

export declare namespace SSHKeys {
  export {
    type SSHKey as SSHKey,
    type SSHKeyListResponse as SSHKeyListResponse,
    type SSHKeyDeleteResponse as SSHKeyDeleteResponse,
    type SSHKeyAddParams as SSHKeyAddParams,
  };
}
