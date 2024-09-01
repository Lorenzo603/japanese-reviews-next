import { getAppDirRequestHandler } from 'supertokens-node/nextjs';
import { NextResponse } from 'next/server';
import { ensureSuperTokensInit } from '../../../(auth)/sign-in/config/backend';

ensureSuperTokensInit();

const handleCall = getAppDirRequestHandler(NextResponse);

export async function GET(request) {
  const res = await handleCall(request);
  if (!res.headers.has('Cache-Control')) {
    // This is needed for production deployments with Vercel
    res.headers.set(
      'Cache-Control',
      'no-cache, no-store, max-age=0, must-revalidate'
    )
  }
  return res;
}

export async function POST(request) {
  return handleCall(request);
}

export async function DELETE(request) {
  return handleCall(request);
}

export async function PUT(request) {
  return handleCall(request);
}

export async function PATCH(request) {
  return handleCall(request);
}

export async function HEAD(request) {
  return handleCall(request);
}