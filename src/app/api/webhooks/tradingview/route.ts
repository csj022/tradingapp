/**
 * TradingView Webhook API Route
 * POST /api/webhooks/tradingview - Receive TradingView alerts
 * GET /api/webhooks/tradingview - Health check
 */

import { NextRequest, NextResponse } from 'next/server';

// Webhook secret for validation
const WEBHOOK_SECRET = process.env.TRADINGVIEW_WEBHOOK_SECRET || 'dev-secret';

interface TradingViewAlert {
    ticker: string;
    action: 'buy' | 'sell' | 'close';
    price: number;
    time?: string;
    interval?: string;
    strategy?: string;
    message?: string;
}

// Validate webhook payload
function validatePayload(body: unknown): body is TradingViewAlert {
    if (!body || typeof body !== 'object') return false;
    const alert = body as Record<string, unknown>;
    return (
          typeof alert.ticker === 'string' &&
          typeof alert.action === 'string' &&
          ['buy', 'sell', 'close'].includes(alert.action as string) &&
          typeof alert.price === 'number'
        );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
          // Validate webhook secret
      const url = new URL(request.url);
          const secretParam = url.searchParams.get('secret');
          const secretHeader = request.headers.get('x-webhook-secret');

      if (secretParam !== WEBHOOK_SECRET && secretHeader !== WEBHOOK_SECRET) {
              console.warn('[Webhook] Invalid or missing secret');
              return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const body = await request.json();

      if (!validatePayload(body)) {
              return NextResponse.json({ success: false, error: 'Invalid payload format' }, { status: 400 });
      }

      const alert = body as TradingViewAlert;
          const signalType = alert.action === 'buy' ? 'BUY' : 'SELL';

      console.log(`[Webhook] TradingView signal: ${signalType} ${alert.ticker} @ ${alert.price}`);

      return NextResponse.json({
              success: true,
              data: { received: true },
              message: `Signal processed: ${signalType} ${alert.ticker}`
      });
    } catch (error) {
          console.error('[Webhook] Error:', error);
          return NextResponse.json({ success: false, error: 'Failed to process webhook' }, { status: 500 });
    }
}

// Health check
export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
          success: true,
          data: { status: 'ready' },
          message: 'TradingView webhook endpoint is active'
    });
}
