import 'server-only';

import { NextResponse } from 'next/server';

const noStoreHeaders = { 'Cache-Control': 'no-store' };

// Only network/abort failures reach here; upstream HTTP statuses are forwarded as-is.
export const errorResponse = () =>
  NextResponse.json(
    { message: 'API request failed' },
    { status: 502, headers: noStoreHeaders },
  );
