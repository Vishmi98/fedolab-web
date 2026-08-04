"use client";

import { useEffect, useState } from "react";
import {
    BiBarChart,
    BiLineChart,
    BiCalendar,
    BiRefresh,
} from "react-icons/bi";

import { URL } from "@/constants/config";

interface MarketSummaryData {
    tradeVolume: number;
    shareVolume: number;
    tradeDate: number;
    trades: number;
    lastUpdated: string;
}

export default function MarketSummary() {
    const [summary, setSummary] = useState<MarketSummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSummary() {
            try {
                const res = await fetch(`${URL}/market/summary`);

                const json = await res.json();

                setSummary(json.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadSummary();
    }, []);

    if (loading) {
        return (
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                Loading market summary...
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="rounded-xl border border-red-300 bg-red-50 p-6">
                Failed to load market summary.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500">
                        Trade Volume
                    </p>

                    <BiBarChart className="text-xl text-emerald-500" />
                </div>

                <p className="mt-4 text-2xl font-bold">
                    LKR {summary.tradeVolume.toLocaleString()}
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500">
                        Share Volume
                    </p>

                    <BiLineChart className="text-xl text-blue-500" />
                </div>

                <p className="mt-4 text-2xl font-bold">
                    {summary.shareVolume.toLocaleString()}
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500">
                        Trades
                    </p>

                    <BiBarChart className="text-xl text-orange-500" />
                </div>

                <p className="mt-4 text-2xl font-bold">
                    {summary.trades.toLocaleString()}
                </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-neutral-500">
                        Trade Date
                    </p>

                    <BiCalendar className="text-xl text-violet-500" />
                </div>

                <p className="mt-4 text-lg font-bold">
                    {new Date(summary.tradeDate).toLocaleDateString()}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
                    <BiRefresh />

                    <span>
                        Updated{" "}
                        {new Date(summary.lastUpdated).toLocaleString()}
                    </span>
                </div>
            </div>

        </div>
    );
}