// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Per-VM service registrations exposed via the public 4to6 HTTP proxy
 */
export class Services extends APIResource {
  /**
   * Idempotent register-or-update: same name + new port updates the port; same
   * name + same port is a no-op. Returns the resulting entry. Used to change the
   * upstream port for an existing service registration without dropping and
   * re-creating it.
   */
  update(serviceName: string, params: ServiceUpdateParams, options?: RequestOptions): APIPromise<Service> {
    const { id, ...body } = params;
    return this._client.put(path`/v1/vms/${id}/services/${serviceName}`, { body, ...options });
  }

  /**
   * Returns the services currently registered on this VM, sorted by name. Each
   * service is exposed at `https://<name>--<vmIdHexNoHyphens>.proxy.<stack-domain>`
   * over HTTPS.
   */
  list(id: string, options?: RequestOptions): APIPromise<ServiceListResponse> {
    return this._client.get(path`/v1/vms/${id}/services`, options);
  }

  /**
   * Idempotent: deleting a service that doesn't exist returns 204. Removes the
   * firewall auto-rule synchronously; the proxy stops routing to the service within
   * seconds (cache invalidation broadcast; 30s TTL is the safety net).
   */
  delete(serviceName: string, params: ServiceDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { id } = params;
    return this._client.delete(path`/v1/vms/${id}/services/${serviceName}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Registers an HTTP service on the VM under `name`, listening on `port`. The
   * service immediately becomes addressable at
   * `https://<name>--<vmIdHexNoHyphens>.proxy.<stack-domain>` once the firewall is
   * applied (synchronous).
   *
   * Idempotent: a POST with a name that already exists at the same `(port, h2c)`
   * returns 201 with the existing entry. POST with a name that already exists at a
   * different port OR different `h2c` returns 409 — use PUT to update an existing
   * service.
   *
   * Per-VM cap: currently 16 services per VM (configurable via `MAX_SERVICES_PER_VM`
   * on the scheduler).
   */
  register(id: string, body: ServiceRegisterParams, options?: RequestOptions): APIPromise<Service> {
    return this._client.post(path`/v1/vms/${id}/services`, { body, maxRetries: 0, ...options });
  }
}

export interface Service {
  /**
   * When true, the proxy speaks HTTP/2 cleartext (h2c) to the backend. Required for
   * gRPC and h2c-only apps. When false (default), the proxy uses HTTP/1.1 — covers
   * HTTP/1.1 apps, Server-Sent Events, and WebSocket pass-through.
   */
  h2c: boolean;

  /**
   * Service name (1–29 chars). Embedded in the public URL as
   * `<name>--<vmIdHexNoHyphens>.proxy.<stack-domain>`.
   */
  name: string;

  /**
   * TCP port the service listens on inside the VM. Privileged ports (<1024) are
   * rejected.
   */
  port: number;
}

export type ServiceListResponse = Array<Service>;

export interface ServiceUpdateParams {
  /**
   * Path param: VM ID (UUID).
   */
  id: string;

  /**
   * Body param: New TCP port. Same value as the existing entry is a no-op.
   */
  port: number;

  /**
   * Body param: Optional. When true, the proxy uses HTTP/2 cleartext to the backend.
   * Same value as the existing entry is a no-op; a different value updates the
   * registered transport.
   */
  h2c?: boolean;
}

export interface ServiceDeleteParams {
  /**
   * VM ID (UUID).
   */
  id: string;
}

export interface ServiceRegisterParams {
  name: string;

  port: number;

  /**
   * Optional. When true, the proxy uses HTTP/2 cleartext to the backend (required
   * for gRPC). Defaults to false (HTTP/1.1).
   */
  h2c?: boolean;
}

export declare namespace Services {
  export {
    type Service as Service,
    type ServiceListResponse as ServiceListResponse,
    type ServiceUpdateParams as ServiceUpdateParams,
    type ServiceDeleteParams as ServiceDeleteParams,
    type ServiceRegisterParams as ServiceRegisterParams,
  };
}
