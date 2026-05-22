// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * BYO GCS/S3 bucket mounts as a VM sub-resource.
 */
export class BucketMounts extends APIResource {
  /**
   * Get a bucket-mount
   */
  retrieve(
    bucketMountID: string,
    params: BucketMountRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<Shared.BucketMount> {
    const { id } = params;
    return this._client.get(path`/v1/vms/${id}/bucket-mounts/${bucketMountID}`, options);
  }

  /**
   * List bucket-mounts on a VM
   */
  list(id: string, options?: RequestOptions): APIPromise<BucketMountListResponse> {
    return this._client.get(path`/v1/vms/${id}/bucket-mounts`, options);
  }

  /**
   * Detach and delete a bucket-mount
   */
  delete(bucketMountID: string, params: BucketMountDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { id } = params;
    return this._client.delete(path`/v1/vms/${id}/bucket-mounts/${bucketMountID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Attach a customer GCS / S3 bucket to a VM
   */
  attach(
    id: string,
    body: BucketMountAttachParams,
    options?: RequestOptions,
  ): APIPromise<Shared.BucketMount> {
    return this._client.post(path`/v1/vms/${id}/bucket-mounts`, { body, maxRetries: 0, ...options });
  }

  /**
   * Replaces the stored credentials and re-authenticates the FUSE mount on the
   * worker. Brief I/O blip (~50-200 ms typical) during the swap. Returns 502 on the
   * rollback path; flips `mountStatus` to `failed` on full failure.
   */
  rotate(
    bucketMountID: string,
    params: BucketMountRotateParams,
    options?: RequestOptions,
  ): APIPromise<Shared.BucketMount> {
    const { id, ...body } = params;
    return this._client.patch(path`/v1/vms/${id}/bucket-mounts/${bucketMountID}`, { body, ...options });
  }
}

export type BucketMountListResponse = Array<Shared.BucketMount>;

export interface BucketMountRetrieveParams {
  /**
   * VM ID (UUID).
   */
  id: string;
}

export interface BucketMountDeleteParams {
  /**
   * VM ID (UUID).
   */
  id: string;
}

export interface BucketMountAttachParams {
  /**
   * Customer's GCS or S3 bucket URI. `gs://<bucket>[/prefix]` or
   * `s3://<bucket>[/prefix]`.
   */
  bucketUri: string;

  /**
   * Customer-provided credentials. Never returned in API responses. Discriminated
   * union: the `type` property selects the per-provider shape so SDKs surface typed
   * per-type values.
   */
  credentials: BucketMountAttachParams.GcpServiceAccountCredentials | BucketMountAttachParams.AwsCredentials;

  mountPath: string;

  readOnly?: boolean;
}

export namespace BucketMountAttachParams {
  export interface GcpServiceAccountCredentials {
    type: 'gcp-service-account-json';

    value: GcpServiceAccountCredentials.Value;
  }

  export namespace GcpServiceAccountCredentials {
    export interface Value {
      client_email: string;

      private_key: string;

      type: 'service_account';
    }
  }

  export interface AwsCredentials {
    type: 'aws-credentials';

    value: AwsCredentials.Value;
  }

  export namespace AwsCredentials {
    export interface Value {
      /**
       * AWS shared-credentials INI text. Must contain a `[default]` section with
       * `aws_access_key_id` and `aws_secret_access_key`.
       */
      data: string;
    }
  }
}

export interface BucketMountRotateParams {
  /**
   * Path param: VM ID (UUID).
   */
  id: string;

  /**
   * Body param: Customer-provided credentials. Never returned in API responses.
   * Discriminated union: the `type` property selects the per-provider shape so SDKs
   * surface typed per-type values.
   */
  credentials: BucketMountRotateParams.GcpServiceAccountCredentials | BucketMountRotateParams.AwsCredentials;
}

export namespace BucketMountRotateParams {
  export interface GcpServiceAccountCredentials {
    type: 'gcp-service-account-json';

    value: GcpServiceAccountCredentials.Value;
  }

  export namespace GcpServiceAccountCredentials {
    export interface Value {
      client_email: string;

      private_key: string;

      type: 'service_account';
    }
  }

  export interface AwsCredentials {
    type: 'aws-credentials';

    value: AwsCredentials.Value;
  }

  export namespace AwsCredentials {
    export interface Value {
      /**
       * AWS shared-credentials INI text. Must contain a `[default]` section with
       * `aws_access_key_id` and `aws_secret_access_key`.
       */
      data: string;
    }
  }
}

export declare namespace BucketMounts {
  export {
    type BucketMountListResponse as BucketMountListResponse,
    type BucketMountRetrieveParams as BucketMountRetrieveParams,
    type BucketMountDeleteParams as BucketMountDeleteParams,
    type BucketMountAttachParams as BucketMountAttachParams,
    type BucketMountRotateParams as BucketMountRotateParams,
  };
}
