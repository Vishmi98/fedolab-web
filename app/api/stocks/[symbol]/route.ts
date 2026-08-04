/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

import { getCseData } from '@/services/cseService';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;

    try {
        const formattedSymbol = symbol.toUpperCase();

        // Fetch details from CSE API
        const result = await getCseData('/companyInfoSummery', `stock_${formattedSymbol}`, {
            symbol: formattedSymbol,
        });

        // Map according to exact CSE response payload schema
        const raw = result.data || {};
        const info = raw.reqSymbolInfo || {};

        const formattedDetails = {
            symbol: info.symbol || formattedSymbol,
            name: info.name || formattedSymbol,
            price: info.lastTradedPrice ?? 0,
            previousClose: info.previousClose ?? 0,
            change: info.change ?? 0,
            pChange: info.changePercentage ?? 0,
            dayHigh: info.hiTrade ?? info.lastTradedPrice ?? 0,
            dayLow: info.lowTrade ?? info.lastTradedPrice ?? 0,
            volume: info.tdyShareVolume ?? 0,
            marketCap: info.marketCap ?? 0,
            trades: info.tdyTradeVolume ?? 0,
        };

        return NextResponse.json({
            details: formattedDetails,
            lastUpdated: result.lastUpdated,
            cached: result.cached,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Company details are temporarily unavailable.' },
            { status: 503 }
        );
    }
}