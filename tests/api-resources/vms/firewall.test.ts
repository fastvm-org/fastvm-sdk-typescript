// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Fastvm from 'fastvm';

const client = new Fastvm({
  apiKey: 'My API Key',
  bearerToken: 'My Bearer Token',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource firewall', () => {
  // Mock server tests are disabled
  test.skip('patchPolicy', async () => {
    const responsePromise = client.vms.firewall.patchPolicy('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('replacePolicy: only required params', async () => {
    const responsePromise = client.vms.firewall.replacePolicy('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      mode: 'open',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('replacePolicy: required and optional params', async () => {
    const response = await client.vms.firewall.replacePolicy('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      mode: 'open',
      ingress: [
        {
          portStart: 1,
          protocol: 'tcp',
          description: 'description',
          portEnd: 1,
          sourceCidrs: ['string'],
        },
      ],
    });
  });
});
