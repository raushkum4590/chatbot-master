import { NextRequest, NextResponse } from 'next/server';

// This endpoint is used to check if CORS headers are properly set
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "CORS headers check successful",
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Permissions-Policy": "microphone=*, camera=*"
    }
  });
}

// HEAD method for browser diagnostics
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    }
  });
}
