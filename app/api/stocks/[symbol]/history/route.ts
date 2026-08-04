/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { getCseData } from '@/services/cseService';
import { connectDB } from '@/lib/mongodb';
import StockHistory from '@/models/stockHistory.model';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const formattedSymbol = symbol.toUpperCase();

  try {
    await connectDB();

    // 1. Fetch live snapshot from CSE API
    const result = await getCseData('/companyInfoSummery', `stock_${formattedSymbol}`, {
      symbol: formattedSymbol,
    });

    const raw = result.data || {};
    const info = raw.reqSymbolInfo || {};

    const price = info.lastTradedPrice ?? 0;
    const previousClose = info.previousClose ?? 0;
    const dayHigh = info.hiTrade ?? price;
    const dayLow = info.lowTrade ?? price;
    const volume = info.tdyShareVolume ?? 0;
    const trades = info.tdyTradeVolume ?? 0;

    // 2. Persist today's daily snapshot
    const today = new Date().toISOString().split('T')[0];
    await StockHistory.updateOne(
      { symbol: formattedSymbol, date: today },
      {
        $set: {
          open: previousClose || price,
          high: dayHigh,
          low: dayLow,
          close: price,
          volume: volume,
          trades: trades,
        },
      },
      { upsert: true }
    );

    // 3. Query historical performance from DB
    const history = await StockHistory.find({ symbol: formattedSymbol })
      .sort({ date: 1 })
      .lean();

    return NextResponse.json({
      symbol: formattedSymbol,
      history,
      lastUpdated: result.lastUpdated,
      cached: result.cached,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Stock history is temporarily unavailable.' },
      { status: 503 }
    );
  }
}