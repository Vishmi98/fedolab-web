/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { getCseData } from '@/services/cseService';
import { connectDB } from '@/lib/mongodb';
import { getCache, setCache } from '@/lib/cache';
import StockHistory from '@/models/stockHistory.model';


function getStartDateFromPeriod(period: string): Date {
  const now = new Date();
  switch (period) {
    case '1d':
      now.setDate(now.getDate() - 1);
      break;
    case '1w':
      now.setDate(now.getDate() - 7);
      break;
    case '1m':
      now.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      now.setMonth(now.getMonth() - 3);
      break;
    case '1y':
      now.setFullYear(now.getFullYear() - 1);
      break;
    case '3y':
      now.setFullYear(now.getFullYear() - 3);
      break;
    case '5y':
      now.setFullYear(now.getFullYear() - 5);
      break;
    default:
      now.setMonth(now.getMonth() - 1); // Default to 1 Month
      break;
  }
  return now;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1m';

  const formattedSymbol = symbol.toUpperCase();
  const cacheKey = `stock:history:${formattedSymbol}:${period}`;

  try {
    // 1. Check Redis cache first
    const cachedData = await getCache<any>(cacheKey);

    if (cachedData) {
      return NextResponse.json({
        ...cachedData,
        cached: true,
      });
    }

    await connectDB();

    // 2. Fetch live snapshot from CSE API
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

    // 3. Persist today's daily snapshot
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

    // 4. Query historical performance from DB filtered by period date
    const startDate = getStartDateFromPeriod(period).toISOString().split('T')[0];

    const history = await StockHistory.find({
      symbol: formattedSymbol,
      date: { $gte: startDate },
    })
      .sort({ date: 1 })
      .lean();

    const responseData = {
      symbol: formattedSymbol,
      period,
      history,
      lastUpdated: result.lastUpdated || new Date().toISOString(),
      cached: false,
    };

    // 5. Store in Redis cache (60s TTL for real-time stock data)
    await setCache(cacheKey, responseData, 60);

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Stock history is temporarily unavailable.' },
      { status: 503 }
    );
  }
}