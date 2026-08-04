"use client";

import React, { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Props {
    data: Array<{ date: string; close: number; open: number; high: number; low: number }>;
}

const PERIODS = ["1D", "1W", "1M", "3M", "1Y", "3Y", "5Y"];

export function StockChart({ data }: Props) {
    const [selectedPeriod, setSelectedPeriod] = useState("1Y");

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Price Movement</h3>
                <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                    {PERIODS.map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`rounded-md px-3 py-1 text-xs font-semibold transition ${selectedPeriod === period
                                    ? "bg-white text-black shadow dark:bg-neutral-900 dark:text-white"
                                    : "text-neutral-500 hover:text-black dark:hover:text-white"
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={12} domain={["auto", "auto"]} tickLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#171717",
                                border: "none",
                                borderRadius: "8px",
                                color: "#fff",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="close"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorClose)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}