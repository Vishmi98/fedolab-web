/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

import { getCseData } from '@/services/cseService';

export async function GET() {
    try {
        // Fetch summary, status, gainers, losers, most active, and index values in parallel
        const [
            summaryRes,
            statusRes,
            aspiRes,
            snpRes,
            gainersRes,
            losersRes,
            activeRes,
        ] = await Promise.allSettled([
            getCseData('/marketSummery', 'market_summary'),
            getCseData('/marketStatus', 'market_status'),
            getCseData('/aspiData', 'aspi_data'),
            getCseData('/snpData', 'snp_data'),
            getCseData('/topGainers', 'top_gainers'),
            getCseData('/topLooses', 'top_losers'),
            getCseData('/mostActiveTrades', 'most_active'),
        ]);

        const summary = summaryRes.status === 'fulfilled' ? summaryRes.value.data : null;
        const rawStatus = statusRes.status === 'fulfilled' ? statusRes.value.data : null;
        const aspiData = aspiRes.status === 'fulfilled' ? aspiRes.value.data : null;
        const snpData = snpRes.status === 'fulfilled' ? snpRes.value.data : null;
        const gainers = gainersRes.status === 'fulfilled' ? gainersRes.value.data : [];
        const losers = losersRes.status === 'fulfilled' ? losersRes.value.data : [];
        const mostActive = activeRes.status === 'fulfilled' ? activeRes.value.data : [];

        // Normalize market status to "Open" or "Closed"
        const statusText = rawStatus?.status || rawStatus?.marketStatus || '';
        const isMarketOpen =
            statusText.toLowerCase().includes('open') ||
            statusText.toLowerCase().includes('regular trading');

        const isCached =
            (summaryRes.status === 'fulfilled' && summaryRes.value.cached) ||
            (statusRes.status === 'fulfilled' && statusRes.value.cached);

        return NextResponse.json({
            status: isMarketOpen ? 'Open' : 'Closed',
            rawStatus: statusText, // Kept for debugging/UI subheadings
            aspi: {
                value: aspiData?.value ?? summary?.aspi ?? 0,
                change: aspiData?.change ?? summary?.aspiChange ?? 0,
            },
            spSl20: {
                value: snpData?.value ?? summary?.snpsl20 ?? 0,
                change: snpData?.change ?? summary?.snpChange ?? 0,
            },
            turnover: summary?.tradeVolume ?? summary?.turnover ?? 0,
            volume: summary?.shareVolume ?? summary?.volume ?? 0,
            trades: summary?.tradeCount ?? summary?.trades ?? 0,
            topGainers: Array.isArray(gainers) ? gainers : [],
            topLosers: Array.isArray(losers) ? losers : [],
            mostActive: Array.isArray(mostActive) ? mostActive : [],
            lastUpdated: new Date().toISOString(),
            cached: isCached,
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Market data is temporarily unavailable.' },
            { status: 503 }
        );
    }
}