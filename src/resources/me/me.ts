// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as SSHKeysAPI from './ssh-keys';
import { SSHKey, SSHKeyAddParams, SSHKeyDeleteResponse, SSHKeyListResponse, SSHKeys } from './ssh-keys';

export class Me extends APIResource {
  sshKeys: SSHKeysAPI.SSHKeys = new SSHKeysAPI.SSHKeys(this._client);
}

Me.SSHKeys = SSHKeys;

export declare namespace Me {
  export {
    SSHKeys as SSHKeys,
    type SSHKey as SSHKey,
    type SSHKeyListResponse as SSHKeyListResponse,
    type SSHKeyDeleteResponse as SSHKeyDeleteResponse,
    type SSHKeyAddParams as SSHKeyAddParams,
  };
}
