// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Fastvm from 'fastvm';

const client = new Fastvm({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource bucketMounts', () => {
  test('retrieve: only required params', async () => {
    const responsePromise = client.vms.bucketMounts.retrieve('bucketMountId', { id: 'id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('retrieve: required and optional params', async () => {
    const response = await client.vms.bucketMounts.retrieve('bucketMountId', { id: 'id' });
  });

  test('list', async () => {
    const responsePromise = client.vms.bucketMounts.list('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: only required params', async () => {
    const responsePromise = client.vms.bucketMounts.delete('bucketMountId', { id: 'id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('delete: required and optional params', async () => {
    const response = await client.vms.bucketMounts.delete('bucketMountId', { id: 'id' });
  });

  test('attach: only required params', async () => {
    const responsePromise = client.vms.bucketMounts.attach('id', {
      bucketUri: 'bucketUri',
      credentials: {
        type: 'gcp-service-account-json',
        value: {
          client_email: 'client_email',
          private_key: 'private_key',
          type: 'service_account',
        },
      },
      mountPath: 'mountPath',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('attach: required and optional params', async () => {
    const response = await client.vms.bucketMounts.attach('id', {
      bucketUri: 'bucketUri',
      credentials: {
        type: 'gcp-service-account-json',
        value: {
          client_email: 'client_email',
          private_key: 'private_key',
          type: 'service_account',
        },
      },
      mountPath: 'mountPath',
      readOnly: true,
    });
  });

  test('rotate: only required params', async () => {
    const responsePromise = client.vms.bucketMounts.rotate('bucketMountId', {
      id: 'id',
      credentials: {
        type: 'gcp-service-account-json',
        value: {
          client_email: 'client_email',
          private_key: 'private_key',
          type: 'service_account',
        },
      },
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('rotate: required and optional params', async () => {
    const response = await client.vms.bucketMounts.rotate('bucketMountId', {
      id: 'id',
      credentials: {
        type: 'gcp-service-account-json',
        value: {
          client_email: 'client_email',
          private_key: 'private_key',
          type: 'service_account',
        },
      },
    });
  });
});
