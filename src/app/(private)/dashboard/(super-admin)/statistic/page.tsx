"use client"
import { AutocompleteStyled, KpiStat, SpinnerStyled } from "@/components"
import {
    useGetAllStations,
    useGetAnonymuousStatistic,
    useGetBookingByYear,
    useGetCustomerStatistic,
    useGetRevenueByYear,
    useGetTotalInvoiceStatistic,
    useGetTotalRevenueStatistic,
    useGetVehicleModelStatistic
} from "@/hooks"
import { formatCurrency, formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import { AutocompleteItem } from "@heroui/react"
import { MapPinAreaIcon } from "@phosphor-icons/react"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
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

    const [stationId, setStationId] = useState<string>("")

    const { data: stations, isLoading: isStationsLoading } = useGetAllStations()

    useEffect(() => {
        if (stations && stations.length > 0 && !stationId) setStationId("")
    }, [stationId, stations])

    const { data: totalCustomer, isLoading: isTotalCustomerLoading } = useGetCustomerStatistic({
        stationId
    })
    const { data: totalAnonymous, isLoading: isTotalAnonymousLoading } = useGetAnonymuousStatistic({
        stationId
    })
    const { data: totalRevenue, isLoading: isTotalRevenueLoading } = useGetTotalRevenueStatistic({
        stationId
    })
    const { data: totalInvoice, isLoading: isTotalInvoiceLoading } = useGetTotalInvoiceStatistic({
        stationId
    })
    const { data: vehicleModelStatistic, isLoading: isVehicleModelStatisticLoading } =
        useGetVehicleModelStatistic({ stationId })
    const { data: revenueOverMonths, isLoading: isRevenueOverMonthsLoading } = useGetRevenueByYear({
        stationId
    })
    // const { data: invoiceOverMonths, isLoading: isInvoiceOverMonthsLoading } = useGetInvoiceByYear({
    //     stationId
    // })
    const { data: bookingOverMonths, isLoading: isBookingOverMonthsLoading } = useGetBookingByYear({
        stationId
    })

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

    // const dataMonthsInvoice = invoiceOverMonths?.map((item) => ({
    //     month: item.monthName,
    //     invoices: item.totalInvoice
    // }))

    const dataMonthsBooking = bookingOverMonths?.map((item) => ({
        month: item.monthName,
        booking: item.totalContract
    }))

    if (
        isStationsLoading ||
        isTotalCustomerLoading ||
        isTotalAnonymousLoading ||
        isTotalRevenueLoading ||
        isTotalInvoiceLoading ||
        isVehicleModelStatisticLoading ||
        isRevenueOverMonthsLoading ||
        isBookingOverMonthsLoading
    )
        return <SpinnerStyled />
    return (
        <>
            <div className="max-w-6xl mx-auto w-full">
                <div className="flex justify-around gap-66">
                    <h2 className="text-3xl font-bold mb-6 flex justify-start items-end">
                        {t("statistic.general_statistics")}
                    </h2>
                    <span className="flex justify-end">
                        <section>
                            <AutocompleteStyled
                                label={t("vehicle_model.station")}
                                className="max-w-60 h-20 mr-0"
                                items={stations ?? []}
                                startContent={<MapPinAreaIcon className="text-xl" />}
                                selectedKey={stationId}
                                onSelectionChange={(key) => {
                                    setStationId(String(key))
                                }}
                            >
                                {(stations ?? []).map((item) => (
                                    <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                                ))}
                            </AutocompleteStyled>
                        </section>
                    </span>
                </div>

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
                            <CartesianGrid strokeDasharray="3" stroke="#e2e8f0" />
                            <XAxis
                                dataKey="modelName"
                                tick={{ fill: "#94a3b8", fontSize: 13 }}
                                axisLine={true}
                            />
                            {/* "#94a3b8" */}
                            <YAxis tick={{ fill: "#94a3b8", fontSize: 13 }} axisLine={true} />
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
                                activeDot={{
                                    r: 8,
                                    fill: "#22C55E",
                                    stroke: "#fff",
                                    strokeWidth: 2
                                }}
                                // name="Tổng doanh thu"
                                name={t("statistic.total_revenue")}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Chart total booking for month */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md  m-4 w-full max-w-[60rem]">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                        {t("statistic.monthly_bookings")}
                    </h3>

                    <ResponsiveContainer width="100%" height={320}>
                        <LineChart data={dataMonthsBooking}>
                            <defs>
                                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
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
                                // tickFormatter={(v) => `${v}` + `` + "đơn"}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#555555",
                                    border: "none",
                                    color: "#fff",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                                }}
                                formatter={(value) => [
                                    `${formatCurrency(value as number)}`,
                                    `${t("statistic.booking")}`
                                ]}
                            />
                            <Legend verticalAlign="top" height={36} />

                            {/* Line biểu thị invoice */}
                            <Line
                                type="monotone"
                                dataKey="booking"
                                stroke="url(#bookingGradient)"
                                strokeWidth={4}
                                dot={{ r: 5, fill: "#16A34A" }}
                                activeDot={{
                                    r: 8,
                                    fill: "#22C55E",
                                    stroke: "#fff",
                                    strokeWidth: 2
                                }}
                                // name="Tổng hóa đơn"
                                name={t("statistic.total_bookings")}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    )
}
