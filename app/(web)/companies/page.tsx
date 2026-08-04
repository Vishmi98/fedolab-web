/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    RefreshCw,
    TrendingUp,
    DollarSign,
    Activity,
} from 'lucide-react';

import { formatNumber } from '@/lib/formatters';

interface StockItem {
    symbol: string;
    name: string;
    price: number;
    change: number;
    pChange: number;
    volume: number;
    tradeVolume?: number;
    turnover?: number;
    marketCap?: number;
    high?: number;
    low?: number;
    open?: number;
    previousClose?: number;
    status?: number;
    logoUrl?: string;
    lastTradedTime?: number;
}

type SortField = 'price' | 'pChange' | 'volume' | 'turnover' | 'marketCap' | 'name';
type SortOrder = 'asc' | 'desc';

const CSE_BASE_URL = 'https://www.cse.lk/';

export default function CompanyListPage() {
    const router = useRouter();
    const [stocks, setStocks] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const fetchStocks = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/stocks');
            if (!res.ok) throw new Error('Failed to fetch stock list.');
            const data = await res.json();
            setStocks(data.stocks || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error loading stock list.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleImageError = (symbol: string) => {
        setImageErrors((prev) => ({ ...prev, [symbol]: true }));
    };

    const filteredAndSortedStocks = useMemo(() => {
        return [...stocks]
            .filter(
                (stock) =>
                    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortField === "name") {
                    const compare = a.name.localeCompare(b.name);

                    if (compare !== 0) {
                        return sortOrder === "asc" ? compare : -compare;
                    }

                    return sortOrder === "asc"
                        ? a.symbol.localeCompare(b.symbol)
                        : b.symbol.localeCompare(a.symbol);
                }

                const valA = Number(a[sortField] ?? 0);
                const valB = Number(b[sortField] ?? 0);

                return sortOrder === "asc"
                    ? valA - valB
                    : valB - valA;
            });
    }, [stocks, searchQuery, sortField, sortOrder]);

    if (loading && stocks.length === 0) {
        return (
            <div className="flex h-96 w-full items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="w-[90%] mx-auto py-20 space-y-6 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">DAILY SHARE TRADING STATISTICS (SUMMARY)</h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Real-time equity quotes, turnover, market capitalization, and daily volume.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search symbol or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    />
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={fetchStocks} className="underline font-semibold text-xs">
                        Try Again
                    </button>
                </div>
            )}

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-gray-500 font-medium text-xs uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th
                                    className="py-3.5 px-5 cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('name')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Company
                                        <SortIcon field="name" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>
                                <th
                                    className="py-3.5 px-5 text-right cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('price')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Price (LKR)
                                        <SortIcon field="price" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>

                                <th
                                    className="py-3.5 px-5 text-right cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('pChange')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Change
                                        <SortIcon field="pChange" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>

                                <th className="py-3.5 px-5 text-right">Day High / Low</th>

                                <th
                                    className="py-3.5 px-5 text-right cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('volume')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Volume
                                        <SortIcon field="volume" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>

                                <th
                                    className="py-3.5 px-5 text-right cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('turnover')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Turnover (LKR)
                                        <SortIcon field="turnover" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>

                                <th
                                    className="py-3.5 px-5 text-right cursor-pointer select-none hover:text-gray-900 transition"
                                    onClick={() => handleSort('marketCap')}
                                >
                                    <div className="inline-flex items-center gap-1 justify-end">
                                        Market Cap (LKR)
                                        <SortIcon field="marketCap" sortField={sortField} sortOrder={sortOrder} />
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {filteredAndSortedStocks.length > 0 ? (
                                filteredAndSortedStocks.map((stock) => {
                                    const isPositive = stock.change > 0;
                                    const isNegative = stock.change < 0;
                                    const fullLogoUrl = stock.logoUrl ? `${CSE_BASE_URL}${stock.logoUrl}` : null;
                                    const hasImageError = imageErrors[stock.symbol];

                                    return (
                                        <tr
                                            key={stock.symbol}
                                            onClick={() => router.push(`/stocks/${stock.symbol}`)}
                                            className="hover:bg-gray-50/80 transition cursor-pointer"
                                        >
                                            {/* Symbol & Logo */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    {fullLogoUrl && !hasImageError ? (
                                                        <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={fullLogoUrl}
                                                                alt={stock.name}
                                                                className="w-full h-full object-contain p-0.5"
                                                                onError={() => handleImageError(stock.symbol)}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                                                            {stock.symbol.slice(0, 3)}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-gray-900 text-sm leading-tight truncate">
                                                            {stock.symbol}
                                                        </div>
                                                        <div className="text-xs text-gray-400 truncate max-w-xs">
                                                            {stock.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-3.5 px-5 text-right font-semibold text-gray-900">
                                                {stock.price?.toFixed(2)}
                                            </td>

                                            {/* % Change & Absolute Change */}
                                            <td className="py-3.5 px-5 text-right">
                                                <div
                                                    className={`font-bold ${isPositive
                                                        ? 'text-emerald-600'
                                                        : isNegative
                                                            ? 'text-rose-600'
                                                            : 'text-gray-500'
                                                        }`}
                                                >
                                                    {isPositive ? '+' : ''}
                                                    {stock.pChange?.toFixed(2)}%
                                                </div>
                                                <div className="text-[11px] text-gray-400">
                                                    {isPositive ? '+' : ''}
                                                    {stock.change?.toFixed(2)}
                                                </div>
                                            </td>

                                            {/* Day Range (High/Low) */}
                                            <td className="py-3.5 px-5 text-right text-xs text-gray-500">
                                                {stock.high && stock.low ? (
                                                    <div>
                                                        <span className="text-gray-900 font-medium">
                                                            {stock.high.toFixed(2)}
                                                        </span>
                                                        <span className="mx-1 text-gray-300">/</span>
                                                        <span>{stock.low.toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>

                                            {/* Volume & Trade Count */}
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="font-medium text-gray-800">
                                                    {formatNumber(stock.volume ?? 0)}
                                                </div>
                                                {stock.tradeVolume !== undefined && (
                                                    <div className="text-[11px] text-gray-400">
                                                        {formatNumber(stock.tradeVolume)} trades
                                                    </div>
                                                )}
                                            </td>

                                            {/* Turnover */}
                                            <td className="py-3.5 px-5 text-right font-medium text-gray-800">
                                                {stock.turnover ? formatNumber(stock.turnover) : '-'}
                                            </td>

                                            {/* Market Cap */}
                                            <td className="py-3.5 px-5 text-right font-medium text-gray-600 text-xs">
                                                {stock.marketCap ? formatNumber(stock.marketCap) : '-'}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                                        No matching companies found for &quot;{searchQuery}&quot;
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper Sort Icon Component
function SortIcon({
    field,
    sortField,
    sortOrder,
}: {
    field: SortField;
    sortField: SortField;
    sortOrder: SortOrder;
}) {
    if (sortField !== field) {
        return <ArrowUpDown className="w-3.5 h-3.5 text-gray-300" />;
    }
    return sortOrder === 'asc' ? (
        <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
    ) : (
        <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
    );
}