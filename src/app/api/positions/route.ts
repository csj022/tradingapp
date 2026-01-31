/**
 * Positions API Route
 * GET /api/positions - Fetch open positions
 * POST /api/positions - Close a position
 * DELETE /api/positions - Close all positions
 */

import { NextRequest, NextResponse } from 'next/server';

interface Position {
    id: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnl: number;
    environment: 'paper' | 'live';
}

// In-memory paper trading state
let paperPositions: Position[] = [];
let paperBalance = 100000;

// GET - Fetch all positions
export async function GET(): Promise<NextResponse> {
    const positions = paperPositions;

  const totalValue = positions.reduce((sum, p) => {
        return sum + p.currentPrice * p.quantity;
  }, 0);

  const totalUnrealizedPnl = positions.reduce((sum, p) => {
        return sum + p.unrealizedPnl;
  }, 0);

  return NextResponse.json({
        success: true,
        data: {
                positions,
                environment: 'paper',
                summary: {
                          count: positions.length,
                          totalValue,
                          totalUnrealizedPnl,
                          paperBalance
                }
        }
  });
}

// POST - Close a specific position
export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const { symbol, side } = body;

  if (!symbol || !side) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: symbol, side' },
          { status: 400 }
              );
  }

  const index = paperPositions.findIndex(
        p => p.symbol === symbol.toUpperCase() && p.side === side
      );

  if (index === -1) {
        return NextResponse.json(
          { success: false, error: 'Position not found' },
          { status: 404 }
              );
  }

  const position = paperPositions[index];
    paperBalance += position.currentPrice * position.quantity + position.unrealizedPnl;
    paperPositions.splice(index, 1);

  return NextResponse.json({
        success: true,
        data: { message: `Closed ${symbol} position` }
  });
}

// DELETE - Close all positions
export async function DELETE(): Promise<NextResponse> {
    const count = paperPositions.length;

  paperPositions.forEach(p => {
        paperBalance += p.currentPrice * p.quantity + p.unrealizedPnl;
  });

  paperPositions = [];

  return NextResponse.json({
        success: true,
        data: { closed: count, failed: 0 }
  });
}
