/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  RefreshCw,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { formatNumber } from '@/lib/formatters';
import { MarketSummaryData } from '@/modules/stocks/stock.types';

export default function MarketDashboard() {
  const router = useRouter();
  const [data, setData] = useState<MarketSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'active'>('gainers');

  const fetchMarketSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/market/summary');
      if (!res.ok) throw new Error('Failed to fetch market data');
      const json: MarketSummaryData = await res.json();
      setData(json);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketSummary();
    const interval = setInterval(fetchMarketSummary, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 font-medium">{error || 'No data available'}</p>
        <button
          onClick={fetchMarketSummary}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  const isMarketOpen = data.status === 'Open';

  return (
    <div className="w-[90%] mx-auto py-20 space-y-6 min-h-screen">
      {/* Header & Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colombo Stock Exchange</h1>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Last updated: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleTimeString() : 'N/A'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
              isMarketOpen
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                isMarketOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
              }`}
            />
            {data.rawStatus || data.status}
          </span>

          <button
            onClick={fetchMarketSummary}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Indices Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ASPI Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                ASPI Index
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                {formatNumber(data.aspi?.value ?? 0)}
              </h2>
            </div>
            <div
              className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                (data.aspi?.change ?? 0) >= 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {(data.aspi?.change ?? 0) >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-0.5" />
              )}
              {(data.aspi?.change ?? 0) > 0 ? `+${data.aspi.change}` : data.aspi?.change ?? 0}
            </div>
          </div>
        </div>

        {/* S&P SL20 Card */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                S&P SL20 Index
              </span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">
                {formatNumber(data.spSl20?.value ?? 0)}
              </h2>
            </div>
            <div
              className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                (data.spSl20?.change ?? 0) >= 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {(data.spSl20?.change ?? 0) >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-0.5" />
              )}
              {(data.spSl20?.change ?? 0) > 0 ? `+${data.spSl20.change}` : data.spSl20?.change ?? 0}
            </div>
          </div>
        </div>
      </div>

      {/* Market Statistics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Turnover</p>
            <p className="text-sm font-bold text-gray-900">{formatNumber(data.turnover ?? 0)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Share Volume</p>
            <p className="text-sm font-bold text-gray-900">{formatNumber(data.volume ?? 0)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Trades</p>
            <p className="text-sm font-bold text-gray-900">{formatNumber(data.trades ?? 0)}</p>
          </div>
        </div>
      </div>

      {/* Market Movers Table Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 px-5 pt-4 flex gap-6">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'gainers'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Top Gainers
          </button>

          <button
            onClick={() => setActiveTab('losers')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'losers'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingDown className="w-4 h-4" /> Top Losers
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-sm font-semibold flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Activity className="w-4 h-4" /> Most Active
          </button>
        </div>

        {/* Table Rendering */}
        <div className="overflow-x-auto">
          {activeTab !== 'active' ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Symbol</th>
                  <th className="py-3 px-5 text-right">Price (LKR)</th>
                  <th className="py-3 px-5 text-right">Change</th>
                  <th className="py-3 px-5 text-right">% Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {(activeTab === 'gainers' ? data.topGainers : data.topLosers)?.map((item) => {
                  const isPositive = item.change >= 0;
                  return (
                    <tr
                      key={item.id || item.symbol}
                      onClick={() => router.push(`/stocks/${item.symbol}`)}
                      className="hover:bg-gray-50/80 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-5 font-semibold text-gray-900">{item.symbol}</td>
                      <td className="py-3.5 px-5 text-right font-medium">
                        {item.price?.toFixed(2)}
                      </td>
                      <td
                        className={`py-3.5 px-5 text-right font-semibold ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive ? `+${item.change?.toFixed(2)}` : item.change?.toFixed(2)}
                      </td>
                      <td
                        className={`py-3.5 px-5 text-right font-semibold ${
                          isPositive ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isPositive
                          ? `+${item.changePercentage?.toFixed(2)}%`
                          : `${item.changePercentage?.toFixed(2)}%`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Symbol</th>
                  <th className="py-3 px-5 text-right">Trades</th>
                  <th className="py-3 px-5 text-right">Share Volume</th>
                  <th className="py-3 px-5 text-right">Turnover (LKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {data.mostActive?.map((item) => (
                  <tr
                    key={item.id || item.symbol}
                    onClick={() => router.push(`/stocks/${item.symbol}`)}
                    className="hover:bg-gray-50/80 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-semibold text-gray-900">{item.symbol}</td>
                    <td className="py-3.5 px-5 text-right">{formatNumber(item.tradeVolume ?? 0)}</td>
                    <td className="py-3.5 px-5 text-right">{formatNumber(item.shareVolume ?? 0)}</td>
                    <td className="py-3.5 px-5 text-right font-medium">
                      {formatNumber(item.turnover ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}