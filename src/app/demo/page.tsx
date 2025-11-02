"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import React from "react"
import { KpiStat } from "@/components"
export default function ContractChart() {
    // 🧩 Data mẫu
    const mockData = [
        { month: "Jan", contracts: 25 },
        { month: "Feb", contracts: 40 },
        { month: "Mar", contracts: 32 },
        { month: "Apr", contracts: 50 },
        { month: "May", contracts: 44 },
        { month: "Jun", contracts: 60 },
        { month: "Jul", contracts: 48 },
        { month: "Aug", contracts: 75 },
        { month: "Sep", contracts: 68 },
        { month: "Oct", contracts: 80 },
        { month: "Nov", contracts: 72 },
        { month: "Dec", contracts: 90 }
    ]

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md">
            <div className="mb-5">
                <KpiStat />
            </div>

            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Số xe trong mỗi mẫu
            </h3>

            <ResponsiveContainer width={1000} height={300}>
                <BarChart data={mockData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="month"
                        tick={{ fill: "#94a3b8", fontSize: 13 }}
                        axisLine={false}
                    />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#0f172a",
                            border: "none",
                            color: "white",
                            borderRadius: "8px"
                        }}
                    />
                    <Bar dataKey="contracts" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                            <stop offset="100%" stopColor="#16a34a" stopOpacity={0.7} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
