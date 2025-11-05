"use client"
import { KpiStat } from "@/components"
import {
    useGetAnonymuousStatistic,
    useGetCustomerStatistic,
    useGetInvoiceByYear,
    useGetRevenueByYear,
    useGetTotalInvoiceStatistic,
    useGetTotalRevenueStatistic,
    useGetVehicleModelStatistic
} from "@/hooks/queries/useStatistic"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { useTranslation } from "node_modules/react-i18next"
import React from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts"

export default function StationStatisticPage() {
    const { t } = useTranslation()

    const { data: totalCustomer } = useGetCustomerStatistic()
    const { data: totalAnonymous } = useGetAnonymuousStatistic()
    const { data: totalRevenue } = useGetTotalRevenueStatistic()
    const { data: totalInvoice } = useGetTotalInvoiceStatistic()
    const { data: vehicleModelStatistic } = useGetVehicleModelStatistic()
    const { data: revenueOverMonths } = useGetRevenueByYear()
    const { data: invoiceOverMonths } = useGetInvoiceByYear()

    const dataKpi = [
        {
            title: "Revenue",
            value: totalRevenue?.totalRevenueThisMonth || 0,
            valueLastMonth: totalRevenue?.totalRevenueLastMonth || 0,
            change: totalRevenue?.changeRate || 0
        },
        {
            title: "Invoices",
            value: totalInvoice?.totalStatisticThisMonth || 0,
            valueLastMonth: totalInvoice?.totalStatisticLastMonth || 0,
            change: totalInvoice?.changeRate || 0
        },
        {
            title: "Member",
            value: totalCustomer?.customerInThisMonth || 0,
            valueLastMonth: totalCustomer?.customerInLastMonth || 0,
            change: totalCustomer?.changeRate || 0
        },
        {
            title: "Anonymous",
            value: totalAnonymous?.customerAnonymusInThisMonth || 0,
            valueLastMonth: totalAnonymous?.customerAnonymusInLastMonth || 0,
            change: totalAnonymous?.changeRate || 0
        }
    ]

    const dataVehicleModel = vehicleModelStatistic?.map((item) => ({
        modelId: item.modelId,
        modelName: item.modelName,
        numberOfAvailable: item.numberOfAvailable,
        numberOfRented: item.numberOfRented,
        numberOfMaintenance: item.numberOfMaintenance
    }))

    const dataMonthsRevenue = revenueOverMonths?.map((item) => ({
        month: item.monthName,
        revenue: item.totalRevenue
    }))

    const dataMonthsInvoice = invoiceOverMonths?.map((item) => ({
        month: item.monthName,
        invoices: item.totalInvoice
    }))

    return (
        <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-3xl font-bold mb-6">{t("statistic.general_statistics")}</h2>
            <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {dataKpi.map((item) => (
                    <KpiStat key={item.title} data={item} />
                ))}
            </dl>

            {/* Chart for vehicle model statistics */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md m-4">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 m-10 flex justify-center">
                    {t("statistic.vehicle_count_by_model")}
                </h3>

                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={dataVehicleModel}
                        barSize={40}
                        className="bg-white rounded-2xl mt-4"
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="modelName"
                            tick={{ fill: "#94a3b8", fontSize: 13 }}
                            axisLine={false}
                        />
                        {/* "#94a3b8" */}
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#555555",
                                border: "none",
                                color: "white",
                                borderRadius: "8px"
                            }}
                            formatter={(value, name) => [`${value} chiếc`, name]}
                        />
                        {/* Stack nhiều trạng thái trên 1 cột */}
                        <Legend
                            wrapperStyle={{
                                paddingTop: "10px"
                            }}
                        />
                        <Bar
                            dataKey="numberOfMaintenance"
                            stackId="1"
                            fill="#FACC15"
                            name={t("statistic.maintenance")}
                            radius={[0, 0, 8, 8]}
                        />

                        <Bar
                            dataKey="numberOfAvailable"
                            stackId="1"
                            fill="#4ADE80"
                            name={t("statistic.available")}
                        />
                        <Bar
                            dataKey="numberOfRented"
                            stackId="1"
                            fill="#16A34A"
                            name={t("statistic.rented")}
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Chart for total revenue over months */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md  m-4 w-full max-w-[60rem]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {t("statistic.monthly_revenue")}
                </h3>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dataMonthsRevenue} className="bg-white rounded-2xl mt-4">
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#16A34A" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#94a3b8", fontSize: 13 }}
                            axisLine={true}
                        />
                        <YAxis
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            axisLine={true}
                            tickFormatter={(v) => `${formatCurrencyWithSymbol(v)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#555555",
                                border: "none",
                                color: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}
                            // formatter={(value) => [`${value} triệu ₫`, "Doanh thu"]}
                            formatter={(value) => [
                                `${formatCurrencyWithSymbol(value as number)}`,
                                `${t("statistic.revenue")}`
                            ]}
                        />
                        <Legend verticalAlign="top" height={36} />

                        {/* Line biểu thị doanh thu */}
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="url(#revenueGradient)"
                            strokeWidth={4}
                            dot={{ r: 5, fill: "#16A34A" }}
                            activeDot={{ r: 8, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }}
                            // name="Tổng doanh thu"
                            name={t("statistic.total_revenue")}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Chart total invoice for month */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md  m-4 w-full max-w-[60rem]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {t("statistic.monthly_invoices")}
                </h3>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dataMonthsInvoice}>
                        <defs>
                            <linearGradient id="invoicesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#16A34A" stopOpacity={0.9} />
                                <stop offset="100%" stopColor="#4ADE80" stopOpacity={0.2} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#94a3b8", fontSize: 13 }}
                            axisLine={true}
                        />
                        <YAxis
                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                            axisLine={true}
                            tickFormatter={(v) => `${formatCurrencyWithSymbol(v)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#555555",
                                border: "none",
                                color: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}
                            // formatter={(value) => [`${value} triệu ₫`, "Doanh thu"]}
                            formatter={(value) => [
                                `${formatCurrencyWithSymbol(value as number)}`,
                                `${t("statistic.invoices")}`
                            ]}
                        />
                        <Legend verticalAlign="top" height={36} />

                        {/* Line biểu thị doanh thu */}
                        <Line
                            type="monotone"
                            dataKey="invoices"
                            stroke="url(#invoicesGradient)"
                            strokeWidth={4}
                            dot={{ r: 5, fill: "#16A34A" }}
                            activeDot={{ r: 8, fill: "#22C55E", stroke: "#fff", strokeWidth: 2 }}
                            // name="Tổng doanh thu"
                            name={t("statistic.total_invoices")}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
