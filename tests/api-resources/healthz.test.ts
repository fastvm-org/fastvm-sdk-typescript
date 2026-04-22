// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Fastvm from 'fastvm';

const client = new Fastvm({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource healthz', () => {
  // Mock server tests are disabled
  test.skip('check', async () => {
    const responsePromise = client.healthz.check();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
