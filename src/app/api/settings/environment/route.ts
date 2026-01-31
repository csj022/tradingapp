/**
 * Environment Settings API Route
 * GET /api/settings/environment - Get current environment
 * POST /api/settings/environment - Switch trading environment
 */

import { NextRequest, NextResponse } from 'next/server';

type Environment = 'paper' | 'live';

// In-memory environment state
let currentEnvironment: Environment = 'paper';

// GET - Get current environment
export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
          success: true,
          data: { environment: currentEnvironment }
    });
}

// POST - Change environment
export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const { environment } = body as { environment: Environment };

  if (!environment || !['paper', 'live'].includes(environment)) {
        return NextResponse.json(
          { success: false, error: 'Invalid environment. Must be "paper" or "live"' },
          { status: 400 }
              );
  }

  const previousEnv = currentEnvironment;

  // Safety check for live trading
  if (environment === 'live') {
        console.log('[API] Warning: Switching to LIVE trading mode');
  }

  currentEnvironment = environment;
    console.log(`[API] Environment changed from ${previousEnv} to ${environment}`);

  return NextResponse.json({
        success: true,
        data: {
                environment,
                message: `Trading environment switched to ${environment}`
        }
  });
}
