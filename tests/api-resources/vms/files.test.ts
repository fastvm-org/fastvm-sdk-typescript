// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Fastvm from '@fastvm/sdk';

const client = new Fastvm({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource files', () => {
  test('fetch: only required params', async () => {
    const responsePromise = client.vms.files.fetch('id', { path: 'path', url: 'https://example.com' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('fetch: required and optional params', async () => {
    const response = await client.vms.files.fetch('id', {
      path: 'path',
      url: 'https://example.com',
      timeoutSec: 0,
    });
  });

  test('presign: only required params', async () => {
    const responsePromise = client.vms.files.presign('id', { path: 'path' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('presign: required and optional params', async () => {
    const response = await client.vms.files.presign('id', { path: 'path' });
  });
});
