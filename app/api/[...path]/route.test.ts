import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.stubEnv('API_BASE_URL', 'http://spring-api.internal');

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { GET, PATCH } from './route';

describe('API proxy', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('forwards arbitrary requested paths and query strings unchanged', async () => {
    fetchMock.mockResolvedValue(
      new Response(null, {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );

    const response = await GET(
      new NextRequest(
        'http://localhost/api/custom/resources/4?filter=active&sort=name',
      ),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'http://spring-api.internal/api/custom/resources/4?filter=active&sort=name',
      expect.objectContaining({ method: 'GET', body: undefined }),
    );
    expect(response.status).toBe(200);
  });

  it('forwards the request method, body, and content type', async () => {
    const body = JSON.stringify({ value: 'payload' });
    fetchMock.mockResolvedValue(new Response(null, { status: 202 }));

    const request = new NextRequest(
      'http://localhost/api/anything/accepted/by/spring?x=1',
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Header': 'keep-me',
        },
        body,
      },
    );

    const response = await PATCH(request);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'http://spring-api.internal/api/anything/accepted/by/spring?x=1',
    );
    expect(init.method).toBe('PATCH');
    expect(init.duplex).toBe('half');
    expect(init.headers.get('content-type')).toBe('application/json');
    expect(init.headers.get('x-client-header')).toBe('keep-me');
    expect(response.status).toBe(202);
  });

  it('preserves upstream response headers and status', async () => {
    fetchMock.mockResolvedValue(
      new Response('upstream response', {
        status: 418,
        headers: { 'content-type': 'text/plain', 'x-upstream-id': 'request-7' },
      }),
    );

    const response = await GET(new NextRequest('http://localhost/api/health'));

    expect(response.status).toBe(418);
    expect(response.headers.get('content-type')).toBe('text/plain');
    expect(response.headers.get('x-upstream-id')).toBe('request-7');
    await expect(response.text()).resolves.toBe('upstream response');
  });
});
