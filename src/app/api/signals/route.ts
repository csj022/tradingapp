/**
 * Signals API Route
 */
import { NextRequest, NextResponse } from 'next/server';

interface Signal {
  symbol: string;
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  scores: { twitter: number; unusualWhales: number; tradingview: number };
  timestamp: Date;
}

let cache: Signal[] = [];
let lastUpdate = new Date();

function generateSignals(): Signal[] {
  const symbols = ['ES', 'NQ', 'SPY', 'QQQ', 'AAPL', 'NVDA'];
  return symbols.map(symbol => {
    const scores = {
      twitter: Math.random(),
      unusualWhales: Math.random(),
      tradingview: Math.random()
    };
    const composite = scores.twitter * 0.25 + scores.unusualWhales * 0.35 + scores.tradingview * 0.4;
    return {
      symbol,
      recommendation: composite > 0.65 ? 'BUY' : composite < 0.35 ? 'SELL' : 'HOLD',
      confidence: Math.abs(composite - 0.5) * 2,
      scores,
      timestamp: new Date()
    };
  }).sort((a, b) => b.confidence - a.confidence);
}

export async function GET() {
  if (Date.now() - lastUpdate.getTime() > 30000) {
    cache = generateSignals();
    lastUpdate = new Date();
  }
  return NextResponse.json({ success: true, data: cache });
}
