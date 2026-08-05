/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart2,
  Activity,
  CandlestickChart,
  LineChart as LineChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
  Bar,
  Cell,
} from 'recharts';

import { formatNumber } from '@/lib/formatters';
import { StockDetails, StockHistoryPoint } from '@/modules/stocks/stock.types';


const PERIODS = ['1d', '1w', '1m', '3m', '1y', '3y', '5y'];

/**
 * Custom SVG Candlestick Shape for Recharts
 */
const CustomCandle = (props: any) => {
  const { x, width, yAxis, payload } = props;

  const { open, close, high, low } = payload || {};

  if (
    open === undefined ||
    close === undefined ||
    high === undefined ||
    low === undefined ||
    !yAxis ||
    !yAxis.scale
  ) {
    return null;
  }

  const isBullish = close >= open;
  const color = isBullish ? '#10b981' : '#f43f5e';

  const yOpen = yAxis.scale(open);
  const yClose = yAxis.scale(close);
  const yHigh = yAxis.scale(high);
  const yLow = yAxis.scale(low);

  const candleTop = Math.min(yOpen, yClose);
  const candleBottom = Math.max(yOpen, yClose);
  const candleHeight = Math.max(2, candleBottom - candleTop);

  const candleWidth = Math.max(3, width * 0.5);
  const candleX = x + (width - candleWidth) / 2;
  const wickX = x + width / 2;

  return (
    <g>
      {/* High-Low Wick */}
      <line
        x1={wickX}
        y1={yHigh}
        x2={wickX}
        y2={yLow}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* Open-Close Body */}
      <rect
        x={candleX}
        y={candleTop}
        width={candleWidth}
        height={candleHeight}
        fill={color}
        rx={1}
      />
    </g>
  );
};

export default function StockDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = use(params);

  const [details, setDetails] = useState<StockDetails | null>(null);
  const [history, setHistory] = useState<StockHistoryPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('1m');
  const [chartType, setChartType] = useState<'line' | 'candlestick'>('line');
  const [loading, setLoading] = useState<boolean>(true);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stocks/${symbol}`);
      if (!res.ok) throw new Error('Failed to load stock details.');
      const data = await res.json();
      setDetails(data.details);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Company details are temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStockHistory = async (period: string) => {
    try {
      setHistoryLoading(true);
      const res = await fetch(`/api/stocks/${symbol}/history?period=${period}`);
      if (!res.ok) throw new Error('Failed to load chart history.');
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchStockDetails();
  }, [symbol]);

  useEffect(() => {
    fetchStockHistory(selectedPeriod);
  }, [symbol, selectedPeriod]);

  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return '';

    // Handle YYYY-MM-DD strings without UTC timezone offset shifts
    const parts = tickItem.split('-');
    let date: Date;

    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      date = new Date(tickItem);
    }

    if (isNaN(date.getTime())) return tickItem;

    switch (selectedPeriod) {
      case '1d':
        // If data only has YYYY-MM-DD, fall back to short date representation
        return tickItem.includes('T')
          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1w':
        return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
      case '1m':
      case '3m':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1y':
      case '3y':
      case '5y':
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading && !details) {
    return (
      <div className="flex h-96 w-full items-center justify-center bg-gray-50">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <p className="text-rose-500 font-semibold">{error || 'Stock details unavailable'}</p>
        <Link
          href="/stocks"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isPositive = details.change >= 0;

  const minPrice = history.length ? Math.min(...history.map((d) => d.low)) * 0.99 : 'auto';
  const maxPrice = history.length ? Math.max(...history.map((d) => d.high)) * 1.01 : 'auto';

  return (
    <div className="w-[90%] mx-auto py-20 space-y-6 min-h-screen">
      <div>
        <Link
          href="/stocks"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 gap-1 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Market Overview
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-md">
              {details.symbol}
            </span>
            <span className="text-xs text-gray-400 font-medium">CSE Listed</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{details.name}</h1>
        </div>

        <div className="flex items-baseline gap-4">
          <div>
            <div className="text-3xl font-black text-gray-900">
              LKR {details.price.toFixed(2)}
            </div>
            <div
              className={`flex items-center text-sm font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4 mr-1 inline" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 inline" />
              )}
              {isPositive ? `+${details.change.toFixed(2)}` : details.change.toFixed(2)} (
              {isPositive
                ? `+${details.pChange.toFixed(2)}%`
                : `${details.pChange.toFixed(2)}%`}
              )
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white rounded-xl">
            <div className="flex items-center gap-2 shrink-0">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Share Price Chart
              </h2>
            </div>

            <div className="flex flex-row items-center gap-3 lg:justify-end">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 shrink-0">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 rounded-md transition-colors ${chartType === 'line'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                  title="Line Chart"
                >
                  <LineChartIcon className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setChartType('candlestick')}
                  className={`p-1.5 rounded-md transition-colors ${chartType === 'candlestick'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                  title="Candlestick Chart"
                >
                  <CandlestickChart className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-max">
                  {PERIODS.map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${selectedPeriod === period
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                        }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="h-80 w-full pt-4 relative">
            {historyLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}

            {history.length > 0 ? (
              chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity={0.25}
                        />
                        <stop
                          offset="95%"
                          stopColor={isPositive ? '#10b981' : '#f43f5e'}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={formatXAxis}
                      interval={0}
                      padding={{ left: 20, right: 20 }}
                    />
                    <YAxis
                      domain={[minPrice, maxPrice]}
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={(val) => `${val.toFixed(1)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        border: 'none',
                      }}
                      formatter={(value: any) => [`LKR ${Number(value).toFixed(2)}`, 'Close Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="close"
                      stroke={isPositive ? '#10b981' : '#f43f5e'}
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorPrice)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={history} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={formatXAxis}
                    />
                    <YAxis
                      domain={[minPrice, maxPrice]}
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={(val) => `${val.toFixed(1)}`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as StockHistoryPoint;
                          const isUp = data.close >= data.open;
                          return (
                            <div className="bg-slate-800 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg">
                              <p className="font-semibold text-slate-300 border-b border-slate-700 pb-1 mb-1">{data.date}</p>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <span className="text-slate-400">Open:</span>
                                <span className="font-mono text-right">LKR {data.open.toFixed(2)}</span>
                                <span className="text-slate-400">High:</span>
                                <span className="font-mono text-right text-emerald-400">LKR {data.high.toFixed(2)}</span>
                                <span className="text-slate-400">Low:</span>
                                <span className="font-mono text-right text-rose-400">LKR {data.low.toFixed(2)}</span>
                                <span className="text-slate-400">Close:</span>
                                <span className={`font-mono text-right ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  LKR {data.close.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="high" shape={<CustomCandle />}>
                      {history.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                No historical snapshot data found for this period.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Market Statistics
          </h2>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Previous Close</span>
              <span className="font-bold text-gray-900">
                LKR {details.previousClose.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Day&apos;s Range</span>
              <span className="font-bold text-gray-900">
                {details.dayLow.toFixed(2)} - {details.dayHigh.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Volume</span>
              <span className="font-bold text-gray-900">
                {formatNumber(details.volume)}
              </span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-gray-50">
              <span className="text-gray-500 font-medium">Trade Count</span>
              <span className="font-bold text-gray-900">
                {formatNumber(details.trades)}
              </span>
            </div>

            <div className="flex justify-between py-1.5">
              <span className="text-gray-500 font-medium">Market Cap</span>
              <span className="font-bold text-gray-900">
                {formatNumber(details.marketCap)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}