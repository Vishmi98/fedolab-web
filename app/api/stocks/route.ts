/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import { getCseData } from "@/services/cseService";


export async function GET() {
    try {
        const result = await getCseData("/tradeSummary", "all_stocks");

        const rawStocks = Array.isArray(result.data?.reqTradeSummery)
            ? result.data.reqTradeSummery
            : [];

        const stocks = rawStocks.map((item: any) => ({
            symbol: item.symbol,
            name: item.name,
            price: item.price,
            change: item.change,
            pChange: item.percentageChange,
            volume: item.sharevolume,
            tradeVolume: item.tradevolume,
            turnover: item.turnover,
            marketCap: item.marketCap,
            high: item.high,
            low: item.low,
            open: item.open,
            previousClose: item.previousClose,
            status: item.status,
            logoUrl: item.logoUrl,
            lastTradedTime: item.lastTradedTime,
        }));

        return NextResponse.json({
            stocks,
            lastUpdated: result.lastUpdated,
            cached: result.cached,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Stock prices are temporarily unavailable.",
            },
            {
                status: 503,
            }
        );
    }
}