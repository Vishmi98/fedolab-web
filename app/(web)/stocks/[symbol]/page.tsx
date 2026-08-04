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
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ComposedChart,
} from 'recharts';

import { formatNumber } from '@/lib/formatters';
import { StockDetails, StockHistoryPoint } from '@/modules/stocks/stock.types';

const PERIODS = ['1d', '1w', '1m', '3m', '1y', '3y', '5y'];

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

  // Transform OHLC data for Candlestick visualization
  const candleChartData = history.map((item) => {
    const isBullish = item.close >= item.open;
    return {
      ...item,
      wickMin: item.low,
      wickMax: item.high,
      bodyMin: Math.min(item.open, item.close),
      bodyHeight: Math.max(0.01, Math.abs(item.close - item.open)),
      candleColor: isBullish ? '#10b981' : '#f43f5e',
    };
  });

  return (
    <div className="w-[90%] mx-auto py-20 space-y-6 min-h-screen">
      {/* Back Navigation */}
      <div>
        <Link
          href="/stocks"
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 gap-1 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Market Overview
        </Link>
      </div>

      {/* Main Stock Header Card */}
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

        {/* Price & Day Change */}
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

      {/* Main Grid: Interactive Chart + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Price Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" /> Share Price Chart
            </h2>

            <div className="flex items-center gap-3">
              {/* Chart Mode Switcher */}
              <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setChartType('line')}
                  className={`p-1.5 text-xs font-semibold rounded-lg transition ${chartType === 'line'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                    }`}
                  title="Line Chart"
                >
                  <LineChartIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`p-1.5 text-xs font-semibold rounded-lg transition ${chartType === 'candlestick'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                    }`}
                  title="Candlestick Chart"
                >
                  <CandlestickChart className="w-4 h-4" />
                </button>
              </div>

              {/* Timeframe Selector Buttons */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {PERIODS.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition uppercase ${selectedPeriod === period
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

          {/* Recharts Render */}
          <div className="h-72 w-full pt-4 relative">
            {historyLoading && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            )}

            {history.length > 0 ? (
              chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history}>
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
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={(val) => `LKR ${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        border: 'none',
                      }}
                      formatter={(value: any) => [`LKR ${value}`, 'Close Price']}
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
                /* Candlestick Chart representation */
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={candleChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                    />
                    <YAxis
                      domain={['auto', 'auto']}
                      orientation="right"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      tickFormatter={(val) => `LKR ${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        border: 'none',
                      }}
                      formatter={(value: any, name: any) => [`LKR ${value}`, name.toUpperCase()]}
                    />
                    <Bar dataKey="bodyHeight" fill="#10b981" />
                  </ComposedChart>
                </ResponsiveContainer>
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Historical snapshot data accumulating...
              </div>
            )}
          </div>
        </div>

        {/* Market Key Statistics Panel */}
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