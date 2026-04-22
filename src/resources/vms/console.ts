// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Console extends APIResource {
  /**
   * Upgrade this request to WebSocket and provide `session` query param from
   * `/v1/vms/{id}/console-token`.
   */
  websocket(id: string, query: ConsoleWebsocketParams, options?: RequestOptions): APIPromise<void> {
    return this._client.get(path`/v1/vms/${id}/console/ws`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
      __security: {},
    });
  }
}

export interface ConsoleWebsocketParams {
  session: string;
}

export declare namespace Console {
  export { type ConsoleWebsocketParams as ConsoleWebsocketParams };
}
