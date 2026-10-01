import { NextRequest, NextResponse } from 'next/server';
import { errorResponse } from '@/lib/server/response';
import { apiFetch } from '@/lib/server/api';

async function handleRequest(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith('/api/')) {
    return NextResponse.json(
      { message: 'API route not found' },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const upstreamUri = `${pathname}${request.nextUrl.search}`;
  const method = request.method;
  const hasBody = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  try {
    const response = await apiFetch(upstreamUri, {
      method,
      headers: request.headers,
      body: hasBody ? request.body : undefined,
      // Required by undici/fetch when streaming a request body.
      ...(hasBody ? { duplex: 'half' } : {}),
    } as RequestInit);

    return new NextResponse(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    return errorResponse();
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;
