"use client"
import { KpiStat } from "@/components"
import {
    useGetAnonymuousStatistic,
    useGetCustomerStatistic,
    useGetRevenueByYear,
    useGetTotalInvoiceStatistic,
    useGetTotalRevenueStatistic,
    useGetVehicleModelStatistic
} from "@/hooks/queries/useStatistic"
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

export default function StatisticPage() {
    const { t } = useTranslation()

    const { data: totalCustomer } = useGetCustomerStatistic()
    const { data: totalAnonymous } = useGetAnonymuousStatistic()
    const { data: totalRevenue } = useGetTotalRevenueStatistic()
    const { data: totalInvoice } = useGetTotalInvoiceStatistic()
    const { data: vehicleModelStatistic } = useGetVehicleModelStatistic()
    const { data: revenueOverMonths } = useGetRevenueByYear()

    console.log("totalCustomer", totalCustomer)
    console.log("totalAnonymous", totalAnonymous)
    console.log("totalRevenue", totalRevenue)
    console.log("totalInvoice", totalInvoice)
    console.log("vehicleModelStatistic", vehicleModelStatistic)
    console.log("revenueOverMonths", revenueOverMonths)

    const dataKpi = [
        {
            title: "Revenue",
            value: totalRevenue?.totalRevenueInThisMonth || 0,
            valueLastMonth: totalRevenue?.totalRevenueInLastMonth || 0,
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
            // value: totalCustomer?.totalCustomerInThisMonth || 0,
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

    const dataMonths = revenueOverMonths?.map((item) => ({
        month: item.month,
        revenue: item.revenue
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
                            // dataKey="month"
                            dataKey="modelName"
                            tick={{ fill: "#94a3b8", fontSize: 13 }}
                            axisLine={false}
                        />
                        {/* "#94a3b8" */}
                        <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#555555",
                                // backgroundColor: "#f4f4f4",
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
                            //numberOfMaintenance
                            // dataKey="maintenance"
                            dataKey="numberOfMaintenance"
                            stackId="1"
                            fill="#FACC15"
                            name={t("statistic.maintenance")}
                            radius={[0, 0, 8, 8]}
                        />

                        <Bar
                            //numberOfAvailable
                            // dataKey="available"
                            dataKey="numberOfAvailable"
                            stackId="1"
                            fill="#4ADE80"
                            name={t("statistic.available")}
                        />
                        <Bar
                            //numberOfRented
                            // dataKey="active"
                            dataKey="numberOfRented"
                            stackId="1"
                            // fill="#16a34a"
                            fill="#16A34A"
                            name={t("statistic.rented")}
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Chart for total revenue over months */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md  m-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                    {t("statistic.monthly_revenue")}
                </h3>

                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dataMonths}>
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
                            axisLine={false}
                        />
                        <YAxis
                            tick={{ fill: "#94a3b8", fontSize: 13 }}
                            axisLine={false}
                            tickFormatter={(v) => `${v}tr`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#555555",
                                border: "none",
                                color: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}
                            formatter={(value) => [`${value} triệu ₫`, "Doanh thu"]}
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
                            name="Tổng doanh thu"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
